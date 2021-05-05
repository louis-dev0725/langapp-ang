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
class DictionaryWord extends ActiveRecord
{
    public const TYPE_JAPANESE_WORD = 1;
    public const TYPE_JAPANESE_KANJI = 2;

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '{{%dictionary_word}}';
    }

    public function getMeaningForLangList($langList)
    {
        $currentLangPos = PHP_INT_MAX;
        $currentValue = '';
        if (isset($this->data['meanings'])) {
            foreach ($this->data['meanings'] as $meaning) {
                if (isset($meaning['lang']) && ($pos = array_search($meaning['lang'], $langList)) !== false && $pos < $currentLangPos) {
                    $currentValue = $meaning['value'];
                    if ($pos === 0) {
                        return $currentValue;
                    }
                }
            }
        }

        return $currentValue;
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [];
    }
}
