<?php

namespace app\models;


use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%content}}".
 *
 * @property int $id
 * @property string $title
 * @property int $type_content
 * @property string $source_link
 * @property string $text
 * @property int $status
 * @property int $count_symbol
 * @property string $level_JLPT
 * @property int $deleted
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
            [['title', 'type_content', 'source_link', 'text', 'count_symbol', 'level_JLPT'], 'required'],
            [['type_content'], 'default', 'value' => 1],
            [['status', 'count_symbol', 'deleted'], 'default', 'value' => 0],
            [['type_content', 'status', 'count_symbol', 'deleted'], 'integer'],
            [['text'], 'string'],
            [['title', 'source_link', 'level_JLPT'], 'string', 'max' => 255],
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
            'type_content' => 'Type Content',
            'source_link' => 'Source Link',
            'text' => 'Text',
            'status' => 'Status',
            'count_symbol' => 'Count Symbol',
            'level_JLPT' => 'Level Jlpt',
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
