<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `{{%mnemonics}}`.
 */
class m200617_084002_create_mnemonics_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%mnemonics}}', [
            'id' => $this->primaryKey(),
            'addedDateTime' => Schema::TYPE_INTEGER . ' NOT NULL',
            'updateDateTime' => Schema::TYPE_INTEGER . ' NOT NULL',
            'user_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'word' => Schema::TYPE_STRING . ' NOT NULL',
            'text' => Schema::TYPE_STRING . ' NULL DEFAULT NULL',
            'images' => Schema::TYPE_STRING . ' NULL DEFAULT NULL',
            'rating' => Schema::TYPE_INTEGER . ' NOT NULL DEFAULT 0',
        ]);

        $this->addForeignKey(
            'mnemonics_users_fk',
            '{{%mnemonics}}',
            'user_id',
            '{{%users}}',
            'id',
            'CASCADE',
            'NO ACTION'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('mnemonics_users_fk', '{{%mnemonics}}');

        $this->dropTable('{{%mnemonics}}');
    }
}
