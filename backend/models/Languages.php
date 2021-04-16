<?php

namespace app\models;


use Yii;
use yii\db\ActiveRecord;

/**
 * @property int $id
 * @property string $title
 * @property string $code
 */
class Languages extends ActiveRecord {

    /**
     * {@inheritdoc}
     */
    public static function tableName () {
        return '{{%languages}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules () {
        return [
            [['title', 'code'], 'required'],
            [['title', 'code'], 'string', 'max' => 255],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels () {
        return [
            'id' => 'ID',
            'title' => 'Title',
            'code' => 'Code',
        ];
    }
}
