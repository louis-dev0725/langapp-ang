<?php

namespace app\models;

use yii\db\ActiveQuery;
use yii\db\ActiveRecord;
use yii\helpers\ArrayHelper;
use DateTimeImmutable;
use DateTimeZone;
use Yii;

/**
 * This is the model class for table "activity_stats".
 *
 * @property int $id
 * @property int $user_id
 * @property string $date
 * @property int $total_seconds
 * @property string|null $details
 * @property int $goal_seconds
 * @property string $currency
 * @property bool $is_penalty_received
 * @property bool $is_goal_reached
 * @property float $penalty_amount
 *
 * @property User $user
 */
class ActivityStats extends ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'activity_stats';
    }

    /**
     * @return array
     */
    public function fields()
    {
        return [
            'date',
            'total_seconds' => 'totalSeconds',
            'goal_seconds' => 'goalSeconds',
            'currency',
            'details',
            'penalty_amount',
            'is_goal_reached',
            'is_penalty_received',
            'is_current_day' => function () {
                return $this->date === date('Y-m-d');
            },
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['user_id', 'date'], 'required'],
            [['user_id'], 'integer'],
            [['total_seconds', 'goal_seconds'], 'default', 'value' => 0],
            [['total_seconds', 'goal_seconds'], 'integer', 'min' => 0],
            [['date'], 'date', 'format' => 'php:Y-m-d'],
            [['details'], 'safe'],
            [['is_penalty_received', 'is_goal_reached'], 'boolean'],
            [['penalty_amount'], 'number'],
            [['currency'], 'string'],
            [['user_id', 'date'], 'unique', 'targetAttribute' => ['user_id', 'date']],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class, 'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'date' => 'Date',
            'total_seconds' => 'Total Seconds',
            'details' => 'Details',
            'goal_seconds' => 'Goal Seconds',
            'is_goal_reached' => 'Is Goal Reached',
            'is_penalty_received' => 'Is Penalty Received',
            'penalty_amount' => 'Penalty Amount',
        ];
    }

    /**
     * @return int
     */
    public function getGoalSeconds()
    {
        return (int) $this->goal_seconds;
    }

    /**
     * @return int
     */
    public function getTotalSeconds()
    {
        return (int) $this->total_seconds;
    }

    /**
     * Gets query for [[User]].
     *
     * @return ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    /**
     * Factory from interim table
     * @param User $user
     * @param string $date
     * @return static
     */
    public static function factory($user, $date)
    {
        $timezone = $user->getDateTimeZone();
        $datetime = DateTimeImmutable::createFromFormat('Y-m-d', $date, $timezone);

        $model = new static();
        $model->date = $date;
        $model->user_id = $user->id;
        $model->total_seconds = 0;
        $model->goal_seconds = $user->dailyGoal;
        $model->currency = $user->currency;
        $model->penalty_amount = $user->penaltyAmount;
        $model->is_penalty_received = false;

        $details = [];

        $from = $datetime->setTime(0, 0, 0)->getTimestamp();
        $to = $datetime->setTime(23, 59, 59)->getTimestamp();
        $query = ActivityInterim::find()->user($user)->date($from, $to);
        /** @var ActivityInterim $interim */
        foreach ($query->each() as $interim) {
            $value = ArrayHelper::getValue($details, [$interim->activity_type], 0);
            ArrayHelper::setValue($details, [$interim->activity_type], $value + $interim->seconds);
            $model->total_seconds += $interim->seconds;
        }

        $model->is_goal_reached = $model->getTotalSeconds() >= $model->getGoalSeconds();
        $model->details = $details;
        return $model;
    }

    /**
     * {@inheritdoc}
     * @return ActivityStatsQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new ActivityStatsQuery(get_called_class());
    }
}
