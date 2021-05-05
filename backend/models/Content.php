<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%content}}".
 *
 * @property int $id
 * @property string $title
 * @property int $type
 * @property string $sourceLink
 * @property string $text
 * @property int $status
 * @property int $length
 * @property string $level
 * @property int $deleted
 * @property int[] $tagsJson
 * @property array $dataJson
 *
 * @property ContentCategory[] $contentCategories
 * @property Category[] $categories
 */
class Content extends ActiveRecord
{
    public $category = [];

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '{{%content}}';
    }

    public function getImageUrl()
    {
        if (isset($this->dataJson['imageUrl'])) {
            return $this->dataJson['imageUrl'];
        } elseif (isset($this->dataJson['youtubeVideo']['videoId'])) {
            return 'http://i3.ytimg.com/vi/' . $this->dataJson['youtubeVideo']['videoId'] . '/hqdefault.jpg';
        }
    }

    public function fields()
    {
        $fields = parent::fields();
        $fields = array_merge($fields, ['imageUrl']);

        return $fields;
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['title', 'type', 'text', 'length'], 'required'],
            [['type', 'status', 'length', 'level', 'deleted'], 'default', 'value' => null],
            [['type', 'status', 'length', 'level', 'deleted'], 'integer'],
            [['text', 'cleanText'], 'string'],
            [['tagsJson', 'dataJson'], 'safe'],
            [['title', 'sourceLink', 'format'], 'string', 'max' => 255],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'title' => 'Title',
            'type' => 'Type',
            'sourceLink' => 'Source Link',
            'text' => 'Text',
            'status' => 'Status',
            'length' => 'Length',
            'level' => 'Level',
            'deleted' => 'Deleted',
            'tagsJson' => 'Tags Json',
            'dataJson' => 'Data Json',
            'format' => 'Format',
            'cleanText' => 'Clean Text',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getContentCategories()
    {
        return $this->hasMany(ContentCategory::class, ['content_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     * @throws \yii\base\InvalidConfigException
     */
    public function getCategories()
    {
        return $this->hasMany(Category::class, ['id' => 'category_id'])
            ->viaTable('{{%content_category}}', ['content_id' => 'id']);
    }
}
