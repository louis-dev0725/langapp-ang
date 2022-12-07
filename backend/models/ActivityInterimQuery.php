<?php

namespace app\models;

use app\components\Helpers;
use yii\db\ActiveQuery;

/**
 * This is the ActiveQuery class for [[ActivityInterim]].
 *
 * @see ActivityInterim
 */
class ActivityInterimQuery extends ActiveQuery
{
    /**
     * @param User|int|string|array $value
     * @return ActivityInterimQuery|$this
     */
    public function user($value)
    {
        if ($value instanceof User) {
            return $this->andWhere(['[[user_id]]' => $value->id]);
        }

        return $this->andWhere(['[[user_id]]' => $value]);
    }

    /**
     * @param string|int $from
     * @param string|int $to
     * @return ActivityInterimQuery|$this
     */
    public function date($from, $to)
    {
        if (is_int($from)) {
            $from = Helpers::dateToSql($from);
        }

        if (is_int($to)) {
            $to = Helpers::dateToSql($to);
        }

        return $this->andWhere(['>=', 'date', $from])
            ->andWhere(['<=', 'date', $to]);
    }

    /**
     * @param string|array $value
     * @return ActivityInterimQuery|$this
     */
    public function nonceToken($value)
    {
        return $this->andWhere(['[[nonce_token]]' => $value]);
    }

    /**
     * {@inheritdoc}
     * @return ActivityInterim[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * {@inheritdoc}
     * @return ActivityInterim|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
