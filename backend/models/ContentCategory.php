<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%content_category}}".
 *
 * @property int $content_id
 * @property int $category_id
 *
 * @property Category $category
 * @property Content $content
 */
class ContentCategory extends ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '{{%content_category}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['content_id', 'category_id'], 'required'], [['content_id', 'category_id'], 'default', 'value' => null],
            [['content_id', 'category_id'], 'integer'],
            [['content_id', 'category_id'], 'unique', 'targetAttribute' => ['content_id', 'category_id']], [
                ['category_id'], 'exist', 'skipOnError' => true, 'targetClass' => Category::class,
                'targetAttribute' => ['category_id' => 'id'],
            ], [
                ['content_id'], 'exist', 'skipOnError' => true, 'targetClass' => Content::class,
                'targetAttribute' => ['content_id' => 'id'],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'content_id' => 'Content ID',
            'category_id' => 'Category ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCategory()
    {
        return $this->hasOne(Category::class, ['id' => 'category_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getContent()
    {
        return $this->hasOne(Content::class, ['id' => 'content_id']);
    }
}
