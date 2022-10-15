<?php

namespace app\controllers;

use app\models\ContentAttribute;
use Throwable;
use Yii;
use yii\base\InvalidConfigException;
use yii\web\NotFoundHttpException;
use yii\web\ServerErrorHttpException;

/**
 * Class ContentAttributeController
 */
class ContentAttributeController extends ActiveController
{
    public $modelClass = ContentAttribute::class;
    public $createScenario = ContentAttribute::SCENARIO_CREATE;
    public $updateScenario = ContentAttribute::SCENARIO_UPDATE;

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['access']['rules'] = [
            [
                'allow' => true,
                'actions' => ['view', 'delete', 'update'],
                'roles' => ['@'],
            ],
        ];

        return $behaviors;
    }

    /**
     * {@inheritDoc}
     */
    public function actions(): array
    {
        $actions = parent::actions();
        unset($actions['index'], $actions['create'], $actions['update']);
        $actions['view']['findModel'] = [$this, 'findModel'];
        $actions['delete']['findModel'] = [$this, 'findModel'];

        return $actions;
    }

    /**
     * @param int|string $id
     * @return ContentAttribute
     * @throws NotFoundHttpException
     * @throws ServerErrorHttpException
     * @throws InvalidConfigException
     */
    public function actionUpdate($id): ContentAttribute
    {
        try {
            $model = $this->findModel($id);
            $model->scenario = $this->updateScenario;
        } catch (NotFoundHttpException $e) {
            $model = new ContentAttribute();
            $model->scenario = $this->createScenario;
            $model->contentId = (int) $id;
        } catch (Throwable $e) {
            throw $e;
        }

        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->save() === false && !$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
        }

        return $model;
    }

    /**
     * @param string|int $id
     * @return ContentAttribute|null
     * @throws NotFoundHttpException
     */
    public function findModel($id): ?ContentAttribute
    {
        $model = ContentAttribute::findOne(['contentId' => $id, 'userId' => Yii::$app->user->id]);
        if ($model !== null) {
            return $model;
        }
        throw new NotFoundHttpException("Object {$id} not found.");
    }
}
