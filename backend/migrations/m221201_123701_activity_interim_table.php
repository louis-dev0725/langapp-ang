<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%activity_interim}}`.
 */
class m221201_123701_activity_interim_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%activity_interim}}', [
            'id' => $this->primaryKey(),
            'user_id' => $this->integer()->notNull(),
            'date' => $this->getDb()->getSchema()->createColumnSchemaBuilder('timestamptz')->notNull(),
            'seconds' => $this->integer()->notNull(),
            'activity_type' => $this->text()->notNull(),
            'nonce_token' => $this->string()->notNull(),
        ]);

        $this->addForeignKey('activity_interim_user_fk', '{{%activity_interim}}', 'user_id', '{{%users}}', 'id', 'CASCADE', 'CASCADE');
        $this->createIndex('activity_interim_user_id_idx', '{{%activity_interim}}', 'user_id');
        $this->createIndex('activity_interim_nonce_token_idx', '{{%activity_interim}}', 'nonce_token');
        $this->createIndex('activity_interim_user_nonce_token_idx', '{{%activity_interim}}', ['user_id', 'nonce_token'], true);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('activity_interim_user_fk', '{{%activity_interim}}');
        $this->dropIndex('activity_interim_user_id_idx', '{{%activity_interim}}');
        $this->dropIndex('activity_interim_nonce_token_idx', '{{%activity_interim}}');

        $this->dropTable('{{%activity_interim}}');
    }
}
