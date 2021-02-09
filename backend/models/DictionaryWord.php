<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\db\ArrayExpression;

/**
 * This is the model class for table "{{%dictionary_word}}".
 *
 * @property int $id
 * @property int $type
 * @property ArrayExpression $query
 * @property array $data
 */
class DictionaryWord extends ActiveRecord {

    const TYPE_JAPANESE_WORD = 1;
    const TYPE_JAPANESE_KANJI = 2;

    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return '{{%dictionary_word}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [];
    }
}
