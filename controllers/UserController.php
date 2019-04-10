<?php

namespace app\controllers;

use app\components\Helpers;
use app\models\LoginForm;
use app\models\PasswordResetForm;
use app\models\RequestPasswordResetForm;
use app\models\Transaction;
use app\models\User;
use app\models\UserSearch;
use Yii;
use yii\data\ActiveDataProvider;
use yii\filters\AccessControl;
use yii\rest\IndexAction;
use yii\web\ForbiddenHttpException;
use yii\web\NotFoundHttpException;
use yii\web\ServerErrorHttpException;

class UserController extends ActiveController
{
    public $modelClass = User::class;

    public function actions()
    {
        $actions = parent::actions();

        unset($actions['create'], $actions['update']);

        $actions['index']['dataFilter'] = [
            'class' => \yii\data\ActiveDataFilter::class,
            'searchModel' => UserSearch::class,
        ];
        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];

        return $actions;
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $availableToEveryone = ['options', 'login', 'create', 'request-reset-password', 'reset-password'];

        $behaviors['authenticator']['optional'] = $availableToEveryone;
        $behaviors['access'] = [
            'class' => AccessControl::class,
            'except' => ['options'],
            'rules' => [
                [
                    'allow' => true,
                    'actions' => $availableToEveryone,
                    //'roles' => ['?'],
                ],
                [
                    'allow' => true,
                    'actions' => ['me', 'update'],
                    'roles' => ['@'],
                ],
                [
                    'allow' => true,
                    'actions' => ['index', 'delete'],
                    'roles' => ['admin'],
                ],
            ]
        ];

        return $behaviors;
    }

    protected function verbs()
    {
        $verbs = parent::verbs();

        $verbs['login'] = ['POST'];
        $verbs['request-reset-password'] = ['POST'];
        $verbs['reset-password'] = ['POST'];

        return $verbs;
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

        $query = User::find();
        if (!empty($filter)) {
            $query->andWhere($filter);
        }

        return Yii::createObject([
            'class' => ActiveDataProvider::class,
            'query' => $query,
            'pagination' => [
                'params' => $requestParams,
            ],
            'sort' => [
                'params' => $requestParams,
                'defaultOrder' => ['id' => SORT_ASC],
            ],
        ]);
    }

    public function actionCreate()
    {
        $model = new User([
            'scenario' => User::SCENARIO_REGISTER,
        ]);

        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->save()) {
            $model->scenario = User::SCENARIO_PROFILE;
            $model->refresh();
            $result = $this->serializeData($model);
            $result['accessToken'] = $model->generateAccessToken();

            return $result;
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
        }

        return $model;
    }

    public function actionLogin()
    {
        $model = new LoginForm();
        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->validate()) {
            $token = $model->user->generateAccessToken();
            return ['accessToken' => $token];
        }

        return $model;
    }

    public function actionRequestResetPassword()
    {
        $model = new RequestPasswordResetForm();
        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->validate()) {
            $sent = $model->sendEmail();
            return ['done' => true, 'successfullySent' => $sent];
        }

        return $model;
    }

    public function actionResetPassword()
    {
        $model = new PasswordResetForm();
        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->validate()) {
            $model->resetPassword();
            $token = $model->user->generateAccessToken();
            return ['done' => true, 'accessToken' => $token];
        }

        return $model;
    }

    public function actionMe()
    {
        $userId = Yii::$app->user->id;
        $model = User::findOne($userId);
        if ($model == null) {
            throw new NotFoundHttpException('User not found');
        }

        $model->scenario = User::SCENARIO_PROFILE;

        return $model;
    }

    public function actionUpdate($id)
    {
        $model = User::findOne($id);
        if ($model == null) {
            throw new NotFoundHttpException("Object not found: $id");
        }

        $this->checkAccess('update', $model);

        $model->scenario = 'profile';
        if (Helpers::isAdmin()) {
            $model->scenario = 'admin';
        }
        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->save()) {
            $result = $this->serializeData($model);
            $result['accessToken'] = $model->generateAccessToken();

            return $result;
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
        }

        return $model;
    }

    /**
     * @param string $action the ID of the action to be executed
     * @param User $model the model to be accessed. If null, it means no specific model is being accessed.
     * @param array $params additional parameters
     * @throws ForbiddenHttpException if the user does not have access
     */
    public function checkAccess($action, $model = null, $params = [])
    {
        if (Helpers::isAdmin()) {
            if ($model != null) {
                $model->scenario = User::SCENARIO_ADMIN;
            }
        } else {
            if ($action == 'create') {
                // Can create user
            } elseif ($action == 'update' || $action == 'view') {
                if ($model->id !== Yii::$app->user->id) {
                    throw new ForbiddenHttpException('You can view/edit only your own profile.');
                }
            } else {
                throw new ForbiddenHttpException();
            }
        }
    }
}
