<?php

namespace app\commands;

use app\components\Helpers;
use app\enums\UserTariff;
use app\models\ActivityInterim;
use app\models\ActivityStats;
use app\models\User;
use Throwable;
use yii\console\Controller;
use yii\helpers\BaseConsole;
use yii\helpers\Json;
use DateTime;
use Yii;

/**
 * Class UserController
 */
class UserController extends Controller
{
    /**
     * This action querying necessary users from the database,
     * and trying to pay fee for the subscription.
     */
    public function actionActivityStatistic(): void
    {
        $query = User::find()->alias('u')
            ->joinWith('paymentMethods pm', true, 'INNER JOIN')
            ->andWhere(['[[u]].[[tariff]]' => UserTariff::FREE])
            ->andWhere(['>=', '[[u]].[[paidUntilDateTime]]', Helpers::dateToSql(time())])
            ->andWhere(['[[pm]].[[isActive]]' => true]);

        echo $this->ansiFormat('SQL: ' . $query->createCommand()->getRawSql(), BaseConsole::FG_YELLOW) . "\n";

        /** @var User $user */
        foreach ($query->each() as $user) {
            echo $this->ansiFormat('Processing User #' . $user->id, BaseConsole::FG_CYAN) . "\n";
            try {
                $datetime = (new DateTime())->setTimezone($user->getDateTimeZone());
                $lastDate = $user->getLastActivityStatDate();

                echo $this->ansiFormat('Timezone: ' . $user->timezone . ', Last Stat Date: ' . $lastDate, BaseConsole::FG_CYAN) . "\n";

                $datetime->modify('-1 day');
                $date = $datetime->format('Y-m-d');

                $userCreated = (new DateTime($user->addedDateTime))->setTimezone($user->getDateTimeZone());
                $createdDate = $userCreated->format('Y-m-d');
                if ($createdDate >= $date || $lastDate >= $date) {
                    continue;
                }

                echo $this->ansiFormat('Processing Date: ' . $date, BaseConsole::FG_CYAN) . "\n";
                $transaction = Yii::$app->db->beginTransaction();
                try {
                    $stat = ActivityStats::factory($user, $date);
                    $valid = $stat->save();

                    // echo $this->ansiFormat('Data: ' . Json::encode($stat->attributes), BaseConsole::FG_CYAN) . "\n";
                    if ($stat->hasErrors()) {
                        echo $this->ansiFormat(Json::encode($stat->errors), BaseConsole::FG_RED, BaseConsole::BG_YELLOW) . "\n";
                        continue;
                    }

                    // if goal not reach, we shall process penalty
                    if ($stat->is_goal_reached === false) {
                        echo $this->ansiFormat('Failed to hit goal, processActivityPenalty(' . $date . ')', BaseConsole::FG_GREEN) . "\n";

                        if ($user->processActivityPenalty($date)) {
                            $stat->is_penalty_received = true;
                            $valid = $stat->save();
                        } else {
                            $valid = false;
                            echo $this->ansiFormat('Failed to processActivityPenalty()', BaseConsole::FG_RED, BaseConsole::BG_YELLOW) . "\n";
                        }
                    }

                    //-- update last activity stat date into dataJson
                    $user->setLastActivityStatDate($date);
                    $valid = $valid && $user->save(false, ['dataJson']);
                    if ($user->hasErrors()) {
                        echo $this->ansiFormat(Json::encode($user->errors), BaseConsole::FG_RED, BaseConsole::BG_YELLOW) . "\n";
                    }

                    $fromTime = $datetime->setTime(0, 0, 0)->getTimestamp();
                    $toTime = $datetime->setTime(23, 59, 59)->getTimestamp();

                    // delete interim activity
                    ActivityInterim::deleteAll([
                        'AND',
                        ['=', '[[user_id]]', $user->id],
                        ['BETWEEN', '[[date]]', Helpers::dateToSql($fromTime), Helpers::dateToSql($toTime)],
                    ]);

                    $valid ? $transaction->commit() : $transaction->rollBack();
                } catch (\Exception $e) {
                    $transaction->rollBack();
                    Yii::error($e);
                }
            } catch (Throwable $e) {
                Yii::error("Failed to generate activity statistic for user $user->id: {$e->__toString()}");
            }
        }
    }
}
