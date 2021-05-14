<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "payment_methods".
 *
 * @property int $id
 * @property int $userId
 * @property string $type
 * @property string $title
 * @property boolean $isActive
 * @property boolean $isDeleted
 * @property string $addedDateTime
 * @property array $data
 */
class PaymentMethod extends \yii\db\ActiveRecord
{
    const TYPE_SQUARE = 'square';

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'payment_methods';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [];
    }

    public function fields() {
        return ['id', 'userId', 'type', 'title'];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'userId' => 'User ID',
            'data' => 'Data',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'userId']);
    }
}
