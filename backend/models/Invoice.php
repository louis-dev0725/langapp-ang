<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "invoices".
 *
 * @property int $id
 * @property int $userId
 */
class Invoice extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'invoices';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['userId'], 'required'],
            [['userId'], 'default', 'value' => null],
            [['userId'], 'integer'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'userId' => Yii::t('app', 'User ID'),
        ];
    }
}
