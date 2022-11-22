<?php

use yii\db\Migration;
use yii\db\pgsql\Schema;

/**
 * Handles adding columns to table `{{%users}}`.
 */
class m221103_075511_add_columns_to_users_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%users}}', 'favoriteCategoryId', 'jsonb NOT NULL DEFAULT \'[]\'::jsonb');
        $this->addColumn('{{%users}}', 'languageLevel', 'text DEFAULT \'\'');
        $this->addColumn('{{%users}}', 'dailyGoal', 'int4 DEFAULT 60');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%users}}', 'favoriteCategoryId');
        $this->dropColumn('{{%users}}', 'languageLevel');
        $this->dropColumn('{{%users}}', 'dailyGoal');
    }
}
