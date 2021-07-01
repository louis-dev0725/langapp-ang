<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%setting_plugin}}".
 *
 * @property int $id
 * @property int $user_id
 * @property string $extensionShowTranslate
 * @property bool $extensionSubtitleTranslate
 *
 * @property User $user
 */
class SettingPlugin extends ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '{{%setting_plugin}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['user_id', 'extensionShowTranslate', 'extensionSubtitleTranslate'], 'required'],
            [['user_id'], 'default', 'value' => null],
            [['user_id'], 'integer'],
            [['extensionSubtitleTranslate'], 'boolean'],
            [['extensionShowTranslate'], 'string', 'max' => 255],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class,
                'targetAttribute' => ['user_id' => 'id'], ],
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
            'extensionShowTranslate' => 'Extension Show Translate',
            'extensionSubtitleTranslate' => 'Extension Subtitle Translate',
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
}
