<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%audio}}`.
 */
class m220831_101535_create_audio_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%audio}}', [
            'id' => $this->primaryKey(),
            'lang' => $this->text()->notNull()->defaultValue(''),
            'text' => $this->text()->notNull()->defaultValue(''),
            'voice' => $this->text()->notNull()->defaultValue(''),
            'file' => $this->text()->notNull()->defaultValue(''),
            'addedDateTime' => $this->timestamp()->notNull()->defaultValue('2000-01-01 00:00:00'),
            'data' => $this->json()->defaultValue('{}'),
        ]);
        $this->createIndex('audio_text_idx', '{{%audio}}', 'text');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%audio}}');
    }
}
