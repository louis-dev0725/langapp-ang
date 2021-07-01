<?php

namespace app\controllers;

use app\components\Helpers;
use app\models\Transaction;
use app\models\TransactionSearch;
use Yii;
use yii\data\ActiveDataFilter;
use yii\data\ActiveDataProvider;
use yii\db\ActiveQuery;
use yii\filters\AccessControl;
use yii\rest\IndexAction;
use yii\web\ForbiddenHttpException;

class TransactionController extends ActiveController
{
    public $modelClass = Transaction::class;
    public $createScenario = Transaction::SCENARIO_ADMIN;
    public $updateScenario = Transaction::SCENARIO_ADMIN;

    public function actions()
    {
        $actions = parent::actions();

        $actions['index']['dataFilter'] = [
            'class' => \yii\data\ActiveDataFilter::class,
            'searchModel' => TransactionSearch::class,
        ];
        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];

        return $actions;
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['access'] = [
            'class' => AccessControl::class,
            'except' => ['options'],
            'rules' => [
                [
                    'allow' => true,
                    'actions' => ['index', 'view'],
                    'roles' => ['@'],
                ],
                [
                    'allow' => true,
                    'actions' => ['create', 'update', 'delete'],
                    'roles' => ['admin'],
                ],
            ],
        ];

        return $behaviors;
    }

    /**
     * @param IndexAction $action
     * @param mixed $filter
     * @return object|ActiveDataProvider
     * @throws \yii\base\InvalidConfigException
     * @throws ForbiddenHttpException
     */
    public function prepareDataProvider($action, $filter)
    {
        $requestParams = Yii::$app->getRequest()->getBodyParams();
        if (empty($requestParams)) {
            $requestParams = Yii::$app->getRequest()->getQueryParams();
        }

        $query = Transaction::find();
        if (!empty($filter)) {
            $query = $this->prepareFilter($query, $filter);
        }

        if (isset($requestParams['expand']) && is_string($requestParams['expand'])) {
            $expand = preg_split('/\s*,\s*/', $requestParams['expand'], -1, PREG_SPLIT_NO_EMPTY);
        } else {
            $expand = [];
        }

        if (!Helpers::isAdmin()) {
            $userId = Yii::$app->user->id;

            // Force filter by userId
            $query->andWhere(['transactions.userId' => $userId]);

            // Check works only for simple filters and doesn't guarantee that there is filter for userId
            if (empty($filter) || (isset($filter['userId']) && $filter['userId'] != $userId)) {
                throw new ForbiddenHttpException("User can only access to own's transactions. You should add filter like ?filter[userId]=$userId");
            }
        }

        if (in_array('user', $expand)) {
            $query->with('user');
        }

        return Yii::createObject([
            'class' => ActiveDataProvider::class,
            'query' => $query,
            'pagination' => [
                'params' => $requestParams,
            ],
            'sort' => [
                'params' => $requestParams,
                'defaultOrder' => ['id' => SORT_DESC],
            ],
        ]);
    }

    /**
     * @param ActiveQuery $query query for the ActiveDataProvider
     * @param array $filter filter condition for the $query
     * @return ActiveQuery
     */
    private function prepareFilter($query, $filter)
    {
        $isComplex = isset($filter[0]) && $filter[0] === 'AND';
        $replaceTransKeys = ['id', 'userId', 'addedDateTime', 'name', 'comment', 'isPartner'];

        $wrapTableName = function ($fieldName, $filterItem) use ($query, $replaceTransKeys) {
            if (!is_array($filterItem)) {
                return;
            }
            $condition = $filterItem;
            if (in_array($fieldName, $replaceTransKeys)) {
                if ($fieldName === 'addedDateTime') {
                    $condition = ['"transactions"."addedDateTime"::DATE' => $filterItem[$fieldName]];
                } elseif ($fieldName === 'name') {
                    $condition = ['like', '"users"."name"', $filterItem[$fieldName]];
                } elseif ($fieldName === 'comment') {
                    $condition = ['like', '"transactions"."comment"', $filterItem[$fieldName]];
                } else {
                    $condition = ['"transactions"."' . $fieldName . '"' => $filterItem[$fieldName]];
                }
            }
            $query->andWhere($condition);
        };

        if ($isComplex) {
            foreach ($filter as $idx => $value) {
                if ($idx > 0) {
                    reset($value);
                    $fieldName = key($value);
                    $wrapTableName($fieldName, $value);
                }
            }
        } else {
            reset($filter);
            $fieldName = key($filter);
            $wrapTableName($fieldName, $filter);
        }

        return $query;
    }

    /**
     * @param string $action the ID of the action to be executed
     * @param Transaction $model the model to be accessed. If null, it means no specific model is being accessed.
     * @param array $params additional parameters
     * @throws ForbiddenHttpException if the user does not have access
     */
    public function checkAccess($action, $model = null, $params = [])
    {
        if (Helpers::isAdmin()) {
            if ($model != null) {
                $model->scenario = Transaction::SCENARIO_ADMIN;
            }
        } else {
            if ($action == 'index') {
                // Allow index
            } elseif ($action == 'view') {
                if ($model->userId !== Yii::$app->user->id) {
                    throw new ForbiddenHttpException();
                }
            } else {
                throw new ForbiddenHttpException();
            }
        }
    }
}
