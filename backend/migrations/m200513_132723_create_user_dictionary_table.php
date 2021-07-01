<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `{{%user_dictionary}}`.
 */
class m200513_132723_create_user_dictionary_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%user_dictionary}}', [
            'id' => Schema::TYPE_PK,
            'user_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'type' => Schema::TYPE_SMALLINT . ' NOT NULL DEFAULT 0',
            'dictionary_word_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'original_word' => Schema::TYPE_STRING . ' NOT NULL',
            'translate_word' => Schema::TYPE_STRING . ' NULL',
            'date' => Schema::TYPE_DATE . ' NOT NULL',
            'context' => Schema::TYPE_TEXT . ' NULL',
            'url' => Schema::TYPE_STRING . ' NULL',
            'success_training' => Schema::TYPE_INTEGER . ' NOT NULL DEFAULT 0',
            'number_training' => Schema::TYPE_INTEGER . ' NOT NULL DEFAULT 0',
            'workout_progress_card' => Schema::TYPE_JSON . " NOT NULL DEFAULT '[]'",
            'workout_progress_word_translate' => Schema::TYPE_JSON . " NOT NULL DEFAULT '[]'",
        ]);

        $this->addForeignKey(
            'user_dictionary_users_fk',
            '{{%user_dictionary}}',
            'user_id',
            '{{%users}}',
            'id',
            'CASCADE',
            'NO ACTION'
        );

        $this->addForeignKey(
            'user_dictionary_dictionary_word_fk',
            '{{%user_dictionary}}',
            'dictionary_word_id',
            '{{%dictionary_word}}',
            'id',
            'CASCADE',
            'NO ACTION'
        );

        $this->createIndex('user_dictionary_pgroonga_index', '{{%user_dictionary}}', 'original_word');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropIndex('user_dictionary_pgroonga_index', '{{%user_dictionary}}');
        $this->dropForeignKey('user_dictionary_dictionary_word_fk', '{{%user_dictionary}}');
        $this->dropForeignKey('user_dictionary_users_fk', '{{%user_dictionary}}');

        $this->dropTable('{{%user_dictionary}}');
    }
}
