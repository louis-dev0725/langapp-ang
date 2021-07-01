<?php

namespace app\controllers;

use app\models\ContentReport;
use Yii;
use yii\db\ActiveQueryInterface;
use yii\filters\AccessControl;
use yii\web\ForbiddenHttpException;

/**
 * Class ContentReportController
 */
class ContentReportController extends ActiveController
{
    public $modelClass = ContentReport::class;
    public $createScenario = ContentReport::SCENARIO_CREATE;
    public $updateScenario = ContentReport::SCENARIO_UPDATE;

    /**
     * {@inheritDoc}
     */
    public function behaviors(): array
    {
        $behaviors = parent::behaviors();
        $behaviors['access'] = [
            'class' => AccessControl::class,
            'except' => ['options'],
            'rules' => [
                [
                    'allow' => true,
                    'actions' => ['create', 'options'],
                    'roles' => ['@'],
                ],
                [
                    'allow' => true,
                    'actions' => ['index', 'view', 'update', 'delete', 'options'],
                    'roles' => ['admin'],
                ],
            ],
        ];

        return $behaviors;
    }
}
