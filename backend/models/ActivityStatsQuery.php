<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[ActivityStats]].
 *
 * @see ActivityStats
 */
class ActivityStatsQuery extends \yii\db\ActiveQuery
{
    /**
     * @param User|int|string|array $value
     * @return ActivityStatsQuery|$this
     */
    public function user($value)
    {
        if ($value instanceof User) {
            return $this->andWhere(['[[user_id]]' => $value->id]);
        }

        return $this->andWhere(['[[user_id]]' => $value]);
    }

    /**
     * {@inheritdoc}
     * @return ActivityStats[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * {@inheritdoc}
     * @return ActivityStats|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
