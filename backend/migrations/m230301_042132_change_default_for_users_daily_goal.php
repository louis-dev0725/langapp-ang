<?php

use yii\db\Migration;

/**
 * Class m230301_042132_change_default_for_users_daily_goal
 */
class m230301_042132_change_default_for_users_daily_goal extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->alterColumn('{{%users}}', 'dailyGoal', 'int4 DEFAULT 600');
        $this->execute('UPDATE {{%users}} SET "dailyGoal" = 600 WHERE "dailyGoal" = 60');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->alterColumn('{{%users}}', 'dailyGoal', 'int4 DEFAULT 60');
    }
}
