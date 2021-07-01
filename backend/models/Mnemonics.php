<?php

namespace app\models;

use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%mnemonics}}".
 *
 * @property int $id
 * @property int $user_id
 * @property string $word
 * @property string|null $text
 * @property string|null $images
 * @property int $rating
 * @property int $addedDateTime
 * @property int $updateDateTime
 *
 * @property User $user
 * @property MnemonicsUsers[] $mnemonicsUsers
 * @property User[] $users
 */
class Mnemonics extends ActiveRecord
{
    public $image;

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '{{%mnemonics}}';
    }

    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::class,
                'attributes' => [
                    ActiveRecord::EVENT_BEFORE_INSERT => ['addedDateTime', 'updateDateTime'],
                    ActiveRecord::EVENT_BEFORE_UPDATE => ['updateDateTime'],
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['user_id', 'word'], 'required'],
            [['text', 'images'], 'default', 'value' => null],
            [['rating'], 'default', 'value' => 0],
            [['user_id', 'rating'], 'integer'],
            [['word', 'text', 'images'], 'string', 'max' => 255],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class, 'targetAttribute' => ['user_id' => 'id']],

            [['image'], 'file', 'skipOnEmpty' => true, 'extensions' => 'png, jpg, jpeg'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'word' => 'Word',
            'text' => 'Text',
            'images' => 'Images',
            'rating' => 'Rating',
        ];
    }

    /**
     * Gets query for [[User]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    /**
     * Gets query for [[MnemonicsUsers]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getMnemonicsUsers()
    {
        return $this->hasMany(MnemonicsUsers::class, ['mnemonics_id' => 'id']);
    }

    /**
     * Gets query for [[Users]].
     *
     * @return \yii\db\ActiveQuery
     * @throws \yii\base\InvalidConfigException
     */
    public function getUsers()
    {
        return $this->hasMany(User::class, ['id' => 'users_id'])
            ->viaTable('{{%mnemonics_users}}', ['mnemonics_id' => 'id']);
    }
}
