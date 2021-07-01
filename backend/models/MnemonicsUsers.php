<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%mnemonics_users}}".
 *
 * @property int $mnemonics_id
 * @property int $users_id
 * @property string $rating
 *
 * @property Mnemonics $mnemonics
 * @property User $users
 */
class MnemonicsUsers extends ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '{{%mnemonics_users}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['mnemonics_id', 'users_id'], 'required'],
            [['mnemonics_id', 'users_id', 'rating'], 'default', 'value' => null],
            [['mnemonics_id', 'users_id', 'rating'], 'string'],
            [['mnemonics_id', 'users_id'], 'unique', 'targetAttribute' => ['mnemonics_id', 'users_id']],
            [['mnemonics_id'], 'exist', 'skipOnError' => true, 'targetClass' => Mnemonics::class, 'targetAttribute' => ['mnemonics_id' => 'id']],
            [['users_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class, 'targetAttribute' => ['users_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'mnemonics_id' => 'Mnemonics ID',
            'users_id' => 'Users ID',
            'rating' => 'Rating',
        ];
    }

    /**
     * Gets query for [[Mnemonics]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getMnemonics()
    {
        return $this->hasOne(Mnemonics::class, ['id' => 'mnemonics_id']);
    }

    /**
     * Gets query for [[Users]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUsers()
    {
        return $this->hasOne(User::class, ['id' => 'users_id']);
    }
}
