<?php

namespace app\models;

use Yii;
use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * Class ContentReport
 *
 * [[Table properties]]
 * @property int $id
 * @property int $contentId
 * @property int $userId
 * @property string $userText
 * @property int $moderatorId
 * @property string $moderatorText
 * @property bool $isProcessed
 *
 * [[Extra properties]]
 * @property Content $content
 * @property User $user
 * @property User $moderator
 */
class ContentReport extends ActiveRecord
{
    public const SCENARIO_CREATE = 'create';
    public const SCENARIO_UPDATE = 'update';

    /**
     * {@inheritDoc}
     */
    public function scenarios(): array
    {
        return [
            self::SCENARIO_CREATE => ['contentId', 'userText'],
            self::SCENARIO_UPDATE => ['moderatorId', 'moderatorText', 'isProcessed'],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function rules(): array
    {
        return [
            [['contentId', 'userText'], 'required'],
            ['contentId', 'integer'],
            ['contentId', 'exist', 'targetRelation' => 'content'],
            ['userText', 'string'],
            ['isProcessed', 'boolean', 'on' => self::SCENARIO_UPDATE],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function beforeSave($insert): bool
    {
        if (!parent::beforeSave($insert)) {
            return false;
        }

        $userId = Yii::$app->user->id;
        // Set userId, when scenario is "create", otherwise moderatorId.
        if ($insert) {
            $this->userId = $userId;
        } else {
            $this->moderatorId = $userId;
        }

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

    public function getModerator(): ActiveQuery
    {
        return $this->hasOne(User::class, ['id' => 'moderatorId']);
    }
}
