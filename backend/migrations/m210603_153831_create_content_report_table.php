<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%content_report}}`.
 */
class m210603_153831_create_content_report_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%content_report}}', [
            'id' => $this->primaryKey(),
            'contentId' => $this->integer()->notNull(),
            'userId' => $this->integer()->notNull(),
            'userText' => $this->text()->notNull()->defaultValue(''),
            'moderatorId' => $this->integer()->notNull()->defaultValue(0),
            'moderatorText' => $this->text()->notNull()->defaultValue(''),
            'isProcessed' => $this->boolean()->notNull()->defaultValue(false),
        ]);

        $this->addForeignKey(
            'fk-content_report-contentId-content-id',
            'content_report',
            'contentId',
            'content',
            'id',
            'CASCADE',
            'CASCADE'
        );
        $this->addForeignKey(
            'fk-content_report-userId-user-id',
            'content_report',
            'userId',
            'users',
            'id',
            'CASCADE',
            'CASCADE'
        );
        $this->addForeignKey(
            'fk-content_report-moderatorId-user-id',
            'content_report',
            'moderatorId',
            'users',
            'id',
            'CASCADE',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('fk-content_report-moderatorId-user-id', 'content_report');
        $this->dropForeignKey('fk-content_report-userId-user-id', 'content_report');
        $this->dropForeignKey('fk-content_report-contentId-content-id', 'content_report');
        $this->dropTable('{{%content_report}}');
    }
}
