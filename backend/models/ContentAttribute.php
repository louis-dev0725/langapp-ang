<?php

namespace app\models;

use Yii;
use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * Class ContentAttribute
 *
 * [[Table properties]]
 * @property int $id
 * @property int $contentId
 * @property int $userId
 * @property bool $isStudied
 * @property bool $isHidden
 *
 * [[Extra properties]]
 * @property Content $content
 * @property User $user
 */
class ContentAttribute extends ActiveRecord
{
    public const SCENARIO_CREATE = 'create';
    public const SCENARIO_UPDATE = 'update';

    /**
     * {@inheritDoc}
     */
    public function scenarios(): array
    {
        return [
            self::SCENARIO_CREATE => ['contentId', 'isStudied', 'isHidden'],
            self::SCENARIO_UPDATE => ['isStudied', 'isHidden'],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function rules(): array
    {
        return [
            ['contentId', 'required'],
            ['contentId', 'integer'],
            ['contentId', 'exist', 'targetRelation' => 'content'],
            ['contentId', 'unique', 'targetAttribute' => ['contentId', 'userId']],
            [['isStudied', 'isHidden'], 'boolean'],
            [['isStudied', 'isHidden'], 'default', 'value' => false],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function beforeValidate(): bool
    {
        if (!parent::beforeValidate()) {
            return false;
        }

        $this->userId = Yii::$app->user->id;

        return true;
    }

    public function getContent(): ActiveQuery
    {
        return $this->hasOne(Content::class, ['id' => 'contentId']);
    }

    public function getUser(): ActiveQuery
    {
        return $this->hasOne(User::class, ['id' => 'userId']);
    }
}
