<?php
/**
 * @author RYU Chua <me@ryu.my>
 */

namespace app\controllers;

use app\components\Helpers;
use app\models\ActivityInterim;
use app\models\ActivitySearch;
use app\models\ActivityStats;
use yii\base\Model;
use yii\data\ActiveDataFilter;
use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;
use DateTime;
use Yii;

class ActivityController extends Controller
{
    /**
     * @return array
     */
    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['access'] = [
            'class' => AccessControl::class,
            'rules' => [
                [
                    'allow' => true,
                    'roles' => ['@'],
                ],
            ],
        ];

        return $behaviors;
    }

    /**
     * @return array
     */
    public function verbs()
    {
        return [
            'create' => ['POST', 'HEAD'],
            'view' => ['GET', 'HEAD'],
        ];
    }

    public function actionCreate()
    {
        $model = new ActivityInterim([
            'scenario' => ActivityInterim::SCENARIO_CREATE,
            'user_id' => Yii::$app->user->id,
            'date' => Helpers::dateToSql(time()),
        ]);
        $model->load(Yii::$app->request->post(), '');

        $model->setScenario(Model::SCENARIO_DEFAULT);
        if ($model->save()) {
            return [
                'success' => true,
                'text' => 'Added new activity',
            ];
        } elseif ($model->hasErrors()) {
            return [
                'success' => false,
                'text' => 'Error while adding activity [E001]',
                'errors' => $model->errors,
            ];
        }

        return [
            'success' => false,
            'text' => 'Error while adding activity [E002]',
        ];
    }

    public function actionView()
    {
        $filter = new ActiveDataFilter(['searchModel' => ActivitySearch::class]);
        $filter->load(Yii::$app->request->get());
        if (empty($filter->filter)) {
            $startDate = (new DateTime())->modify('-365 days')->format('Y-m-d');
            $filter->filter = [
                'date' => [
                    'gte' => $startDate,
                ],
            ];
        }

        if (!$filter->validate() && $filter->hasErrors()) {
            return [
                'success' => false,
                'text' => 'Error while query activity [E001]',
                'errors' => $filter->errors,
            ];
        }

        $query = ActivityStats::find()->user(Yii::$app->user->id);
        $query->andWhere($filter->build())
            ->orderBy(['date' => SORT_ASC]);

        $items = $query->all();

        $eq = ArrayHelper::getValue($filter->filter, ['date', 'eq']);
        $neq = ArrayHelper::getValue($filter->filter, ['date', 'neq']);
        $gte = ArrayHelper::getValue($filter->filter, ['date', 'gte']);
        $gt = ArrayHelper::getValue($filter->filter, ['date', 'gt']);
        $lte = ArrayHelper::getValue($filter->filter, ['date', 'lte']);
        $lt = ArrayHelper::getValue($filter->filter, ['date', 'lt']);

        $user = Helpers::user();
        $today = (new DateTime())->setTimezone($user->getDateTimeZone())->format('Y-m-d');

        if (!empty($eq) && $eq !== $today) {
            $isTodayRequired = false;
        } elseif (!empty($neq) && $neq === $today) {
            $isTodayRequired = false;
        } elseif (!empty($gte) && !empty($lte)) {
            $isTodayRequired = $gte <= $today && $today <= $lte;
        } elseif (!empty($gte) && !empty($lt)) {
            $isTodayRequired = $gte <= $today && $today < $lt;
        } elseif (!empty($gt) && !empty($lte)) {
            $isTodayRequired = $gt < $today && $today <= $lte;
        } elseif (!empty($gt) && !empty($lt)) {
            $isTodayRequired = $gt < $today && $today < $lt;
        } elseif (!empty($gte)) {
            $isTodayRequired = $gte <= $today;
        } elseif (!empty($gt)) {
            $isTodayRequired = $gt < $today;
        } elseif (!empty($lte)) {
            $isTodayRequired = $lte >= $today;
        } elseif (!empty($lt)) {
            $isTodayRequired = $lt > $today;
        } else {
            $isTodayRequired = false;
        }

        // -- add in today data if required
        if ($isTodayRequired) {
            $items[] = ActivityStats::factory(Helpers::user(), $today);
        }

        return [
            'success' => true,
            'items' => $items,
        ];
    }

}