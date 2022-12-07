<?php

namespace app\models;

use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "activity_interim".
 *
 * @property int $id
 * @property int $user_id
 * @property string $date
 * @property int $seconds
 * @property string $activity_type
 * @property string $nonce_token
 *
 * @property User $user
 */
class ActivityInterim extends ActiveRecord
{
    const SCENARIO_CREATE = 'create';

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'activity_interim';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        $validTypes = ['contents', 'drills'];

        return [
            [['user_id', 'date', 'seconds', 'activity_type', 'nonce_token'], 'required'],
            [['user_id'], 'integer'],
            [['seconds'], 'integer', 'min' => 1],
            [['date'], 'safe'],
            [['activity_type'], 'string'],
            [['activity_type'], 'in', 'range' => $validTypes],
            [['nonce_token'], 'string', 'max' => 255],
            [['user_id', 'nonce_token'], 'unique', 'targetAttribute' => ['user_id', 'nonce_token']],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class, 'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    public function scenarios()
    {
        $scenarios = parent::scenarios();
        $scenarios[self::SCENARIO_CREATE] = ['seconds', 'activity_type', 'nonce_token'];
        return $scenarios;
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
            'seconds' => 'Seconds',
            'activity_type' => 'Activity Type',
            'nonce_token' => 'Nonce Token',
        ];
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
     * {@inheritdoc}
     * @return ActivityInterimQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new ActivityInterimQuery(get_called_class());
    }
}
