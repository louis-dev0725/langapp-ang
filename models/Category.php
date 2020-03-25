<?php

namespace app\models;


use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%category}}".
 *
 * @property int $id
 * @property string $title
 * @property int $parent
 *
 * @property ContentCategory[] $contentCategories
 * @property Content[] $contents
 */
class Category extends ActiveRecord {

    /**
     * {@inheritdoc}
     */
    public static function tableName () {
        return '{{%category}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules () {
        return [
            [['title'], 'required'],
            [['parent'], 'default', 'value' => 0],
            [['parent'], 'integer'],
            [['title'], 'string', 'max' => 255],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels () {
        return [
            'id' => 'ID',
            'title' => 'Title',
            'parent' => 'Parent',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getContentCategories () {
        return $this->hasMany(ContentCategory::class, ['category_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     * @throws \yii\base\InvalidConfigException
     */
    public function getContents () {
        return $this->hasMany(Content::class, ['id' => 'content_id'])
            ->viaTable('{{%content_category}}', ['category_id' => 'id']);
    }
}
