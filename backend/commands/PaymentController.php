<?php

namespace app\commands;

use app\components\Helpers;
use app\models\User;
use Throwable;
use Yii;
use yii\console\Controller;

/**
 * Class PaymentController
 */
class PaymentController extends Controller
{
    /**
     * This action querying necessary users from the database,
     * and trying to pay fee for the subscription.
     */
    public function actionSubscriptionFee(): void
    {
        /** @var User[] $users */
        $users = User::find()
            ->joinWith('paymentMethods pm', true, 'INNER JOIN')
            ->where([
                'and',
                ['<', '"users".paidUntilDateTime', Helpers::dateToSql(time() + 3600 * 24)],
                ['pm.isActive' => true],
            ])
            ->all();

        foreach ($users as $user) {
            try {
                $result = $user->paySubscriptionIfNecessary();
                Yii::info("Subscription fee payment result for $user->id: " . json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
            } catch (Throwable $e) {
                Yii::error("Failed to pay subscription fee for user $user->id: {$e->__toString()}");
            }
        }
    }
}
