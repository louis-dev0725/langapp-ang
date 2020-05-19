<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%user_dictionary}}".
 *
 * @property int $id
 * @property int $user_id
 * @property int $type
 * @property int $dictionary_word_id
 * @property string $original_word
 * @property string $translate_word
 * @property string $date
 * @property string $context
 * @property string $url
 * @property int $success_training
 * @property int $number_training
 * @property int $workout_progress_card
 * @property int $workout_progress_word_translate
 *
 * @property DictionaryWord $dictionaryWord
 * @property User $user
 */
class UserDictionary extends ActiveRecord {

    const TYPE_WORD = 0;
    const TYPE_KANJI = 1;

    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return '{{%user_dictionary}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['user_id', 'dictionary_word_id', 'original_word', 'date'], 'required'],
            [['user_id', 'type', 'dictionary_word_id', 'success_training', 'number_training',
                'workout_progress_card', 'workout_progress_word_translate'], 'default', 'value' => null],
            [['user_id', 'type', 'dictionary_word_id', 'success_training', 'number_training',
                'workout_progress_card', 'workout_progress_word_translate'], 'integer'],
            [['date'], 'safe'],
            [['context'], 'string'],
            [['original_word', 'translate_word', 'url'], 'string', 'max' => 255],
            [['dictionary_word_id'], 'exist', 'skipOnError' => true, 'targetClass' => DictionaryWord::class,
                'targetAttribute' => ['dictionary_word_id' => 'id']],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class,
                'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'type' => 'Type',
            'dictionary_word_id' => 'Dictionary Word ID',
            'original_word' => 'Original Word',
            'translate_word' => 'Translate Word',
            'date' => 'Date',
            'context' => 'Context',
            'url' => 'Url',
            'success_training' => 'Success Training',
            'number_training' => 'Number Training',
            'workout_progress_card' => 'Workout Progress Card',
            'workout_progress_word_translate' => 'Workout Progress Word Translate',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDictionaryWord() {
        return $this->hasOne(DictionaryWord::class, ['id' => 'dictionary_word_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser() {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }
}
