<?php

use yii\db\Migration;

/**
 * Class m221201_123707_activity_stats_table
 */
class m221201_123707_activity_stats_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%activity_stats}}', [
            'id' => $this->primaryKey(),
            'user_id' => $this->integer()->notNull(),
            'date' => $this->date()->notNull(),
            'total_seconds' => $this->integer()->notNull()->defaultValue(0),
            'details' => $this->json()->null(),
            'goal_seconds' => $this->integer()->notNull()->defaultValue(0),
            'is_goal_reached' => $this->boolean()->notNull()->defaultValue(false),
            'is_penalty_received' => $this->boolean()->notNull()->defaultValue(false),
            'currency' => $this->string()->notNull(),
            'penalty_amount' => $this->money()->notNull()->defaultValue(0),
        ]);

        $this->addForeignKey('activity_stats_user_fk', '{{%activity_stats}}', 'user_id', '{{%users}}', 'id', 'CASCADE', 'CASCADE');
        $this->createIndex('activity_stats_user_id_idx', '{{%activity_stats}}', 'user_id');
        $this->createIndex('activity_stats_user_date_idx', '{{%activity_stats}}', ['user_id', 'date'], true);

    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('activity_stats_user_fk', '{{%activity_stats}}');
        $this->dropIndex('activity_stats_user_id_idx', '{{%activity_stats}}');
        $this->dropIndex('activity_stats_user_date_idx', '{{%activity_stats}}');

        $this->dropTable('{{%activity_stats}}');
    }
}
