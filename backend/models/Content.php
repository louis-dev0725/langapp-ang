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
class Content extends ActiveRecord {

    public $category = [];

    /**
     * {@inheritdoc}
     */
    public static function tableName () {
        return '{{%content}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules () {
        return [
            [['title', 'type', 'text', 'length', 'level'], 'required'],
            [['type'], 'default', 'value' => 1],
            [['sourceLink'], 'default', 'value' => null],
            [['status', 'length', 'deleted'], 'default', 'value' => 0],
            [['type', 'status', 'length', 'deleted'], 'integer'],
            [['text'], 'string'],
            [['title', 'sourceLink', 'level'], 'string', 'max' => 255],
            ['category', 'safe']
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels () {
        return [
            'id' => 'ID',
            'title' => 'Title',
            'type' => 'Type Content',
            'sourceLink' => 'Source Link',
            'text' => 'Text',
            'status' => 'Status',
            'length' => 'Count Symbol',
            'level' => 'Level Jlpt',
            'deleted' => 'Deleted',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getContentCategories () {
        return $this->hasMany(ContentCategory::class, ['content_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     * @throws \yii\base\InvalidConfigException
     */
    public function getCategories () {
        return $this->hasMany(Category::class, ['id' => 'category_id'])
            ->viaTable('{{%content_category}}', ['content_id' => 'id']);
    }
}
