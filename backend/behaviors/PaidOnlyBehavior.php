<?php

namespace app\behaviors;

use app\controllers\ActiveController;
use app\models\User;
use Yii;
use yii\base\Behavior;
use yii\web\HttpException;

/**
 * Class PaidBehavior
 */
class PaidOnlyBehavior extends Behavior
{
    /**
     * {@inheritDoc}
     */
    public function events(): array
    {
        return [ActiveController::EVENT_BEFORE_ACTION => 'check'];
    }

    /**
     * Checks current user service is paid.
     * @throws HttpException
     */
    public function check(): void
    {
        /** @var User $user */
        $user = Yii::$app->user->identity;
        if (!$user->isPaid) {
            throw new HttpException(402, Yii::t('app', 'Please check your payment details.'));
        }
    }
}
