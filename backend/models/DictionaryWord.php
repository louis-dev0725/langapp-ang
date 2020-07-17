<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%dictionary_word}}".
 *
 * @property int $id
 * @property int $dictionary
 * @property int $idInDictionary
 * @property string $query
 * @property array $sourceData
 */
class DictionaryWord extends ActiveRecord {
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
        return [
            [['dictionary', 'idInDictionary'], 'default', 'value' => null],
            [['dictionary', 'idInDictionary'], 'integer'],
            [['query'], 'string'],
            [['sourceData'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'dictionary' => 'Dictionary',
            'idInDictionary' => 'Id In Dictionary',
            'query' => 'Query',
            'sourceData' => 'Source Data',
        ];
    }
}
