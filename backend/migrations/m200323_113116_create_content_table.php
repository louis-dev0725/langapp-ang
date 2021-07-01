<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `{{%content}}`.
 */
class m200323_113116_create_content_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%content}}', [
            'id' => $this->primaryKey(),
            'title' => Schema::TYPE_STRING . ' NOT NULL',
            'type_content' => Schema::TYPE_TINYINT . ' NOT NULL',
            'source_link' => Schema::TYPE_STRING . ' NULL',
            'text' => Schema::TYPE_TEXT . ' NOT NULL',
            'status' => Schema::TYPE_TINYINT . ' NOT NULL DEFAULT 0',
            'count_symbol' => Schema::TYPE_INTEGER . ' NOT NULL',
            'level_JLPT' => Schema::TYPE_STRING . ' NOT NULL',
            'deleted' => Schema::TYPE_TINYINT . ' NOT NULL DEFAULT 0',
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%content}}');
    }
}
