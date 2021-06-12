<?php

namespace app\models;

use Yii;
use yii\db\ActiveQuery;
use yii\db\ActiveRecord;
use yii\db\Expression;
use yii\helpers\Json;

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
 * @property Content[] $recommendedVideos
 * @property ContentAttribute $contentAttribute
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
     * {@inheritDoc}
     */
    public function extraFields(): array
    {
        return array_merge(parent::extraFields(), [
            'contentAttribute',
            'recommendedVideos',
            'categories',
        ]);
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

    public function getContentAttribute(): ActiveQuery
    {
        return $this->hasOne(ContentAttribute::class, ['contentId' => 'id'])
            ->onCondition(['content_attribute.userId' => Yii::$app->user->id]);
    }

    /**
     * @return array|self[]
     */
    public function getRecommendedVideos(): array
    {
        $defaultConditions = [
            'and',
            ['level' => $this->level],
            ['!=', 'id', $this->id],
        ];
        $orderByExpression = new Expression('random()');

        return self::find()->select('*')
            ->from(
                [
                    'u' => self::find()
                        ->where([
                            ...$defaultConditions,
                            [
                                '@>',
                                'dataJson',
                                Json::encode([
                                    'youtubeVideo' => [
                                        'channel' => [
                                            'id' => $this->dataJson['youtubeVideo']['channel']['id'],
                                        ],
                                    ],
                                ]),
                            ],
                        ])
                        ->limit(20)
                        ->orderBy($orderByExpression)
                        ->union(self::find()
                            ->from('"content" tablesample system(1)')
                            ->where($defaultConditions)
                            ->limit(10)
                            ->orderBy($orderByExpression), true),
                ])
            ->limit(20)
            ->all();
    }
}
