<?php

namespace app\controllers;

use app\behaviors\PaidOnlyBehavior;
use app\components\Helpers;
use app\models\UserDictionary;
use Yii;
use yii\db\Expression;
use yii\web\BadRequestHttpException;

class DrillController extends Controller
{
    /**
     * {@inheritDoc}
     */
    public function behaviors(): array
    {
        return array_merge(parent::behaviors(), [
            'paid' => PaidOnlyBehavior::class,
        ]);
    }

    public function verbs()
    {
        return [
            'list' => ['GET', 'HEAD'],
            'card' => ['GET', 'HEAD'],
            'report-progress' => ['POST'],
            'hide' => ['POST'],
            'settings' => ['GET', 'PATCH'],
        ];
    }

    public function actionList()
    {
        // TODO: implementation
        return json_decode(file_get_contents(__DIR__ . '/../data/drills-index-mock.json'), true);
    }

    public function actionCard($id)
    {
        // TODO: implementation
        $tmp = json_decode(file_get_contents(__DIR__ . '/../data/drills-index-mock.json'), true);
        $result = $tmp['cards']['wordInfo_3236529'];
        $result['cardId'] = $id;
        $result['meanings'][0]['value'] = 'test card for ' . $id;

        return $result;
    }

    public function actionReportProgress()
    {
        $request = Yii::$app->request;
        $drills = $request->getBodyParam('drills');
        if ($drills === null) {
            throw new BadRequestHttpException('Missing required parameter: drills');
        }
        if (!is_array($drills)) {
            throw new BadRequestHttpException('Parameter drills should be an array');
        }

        // TODO: implementation

        return [
            'success' => true,
            'finishContent' => [
                'title' => 'Good job!',
                'text' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut imperdiet tortor. Quisque molestie turpis vitae ante iaculis, a convallis ante porta. Nullam a viverra elit, non interdum sem. Pellentesque quis felis ullamcorper dolor sollicitudin lacinia. Aliquam ac lacinia diam, at viverra urna. Duis eleifend, nunc quis pharetra laoreet, enim ipsum faucibus dui, euismod efficitur metus ipsum in massa. Curabitur dictum, ante non lobortis iaculis, leo mauris cursus nisi, non condimentum nunc ligula in sapien.'
            ]
        ];
    }

    public function actionHide()
    {
        $request = Yii::$app->request;
        $drills = $request->getBodyParam('drills');
        if ($drills === null) {
            throw new BadRequestHttpException('Missing required parameter: drills');
        }
        if (!is_array($drills)) {
            throw new BadRequestHttpException('Parameter drills should be an array');
        }

        $cardToHide = $request->getBodyParam('cardToHide');
        if ($cardToHide === null) {
            throw new BadRequestHttpException('Missing required parameter: card');
        }

        $mode = $request->getBodyParam('mode');
        if ($mode === null) {
            throw new BadRequestHttpException('Missing required parameter: mode');
        }
        if (!in_array($mode, ['onlyCurrentQuestion', 'allWithCurrentWord', 'disableCardType', 'disableAudioQuestionsFor1Hour'])) {
            throw new BadRequestHttpException('parameter mode should be one, allWithThisWord, disableQuestionType or disableAudioQuestionsFor1Hour');
        }

        $drills = array_values(array_filter($drills, function ($drill) use ($cardToHide) {
            return isset($drill['card']) && $drill['card'] != $cardToHide;
        }));

        // TODO: remember hidden cards
        // TODO: filter cards when allWithCurrentWord or disableCardType is used
        // TODO: update settings when disableCardType is used
        // TODO: implementation for disableAudioQuestionsFor1Hour

        return ['drills' => $drills];
    }

    public function actionSettings()
    {
        $user = Helpers::user();
        $settings = isset($user->dataJson['drillSettings']) ? $user->dataJson['drillSettings'] : [];
        if (!isset($settings['disabledCardTypes'])) {
            $settings['disabledCardTypes'] = [];
        }
        if (!isset($settings['autoPlayAudio'])) {
            $settings['autoPlayAudio'] = true;
        }

        $request = Yii::$app->request;
        if ($request->isPatch) {
            $newSettings = $request->getBodyParam('settings');
            if ($newSettings === null) {
                throw new BadRequestHttpException('Missing required parameter: settings');
            }

            $user->dataJson['drillSettings'] = $newSettings;
            $user->save(false, ['dataJson']);

            // TODO: update drills according to new settings

            $drills = $request->getBodyParam('drills');
            if ($drills != null) {
                return ['settings' => $settings, 'drills' => $drills];
            }
        }

        return ['settings' => $settings];
    }
}
