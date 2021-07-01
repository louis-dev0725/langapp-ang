<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%content_attribute}}`.
 */
class m210606_183553_create_content_attribute_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%content_attribute}}', [
            'id' => $this->primaryKey(),
            'contentId' => $this->integer()->notNull()->defaultValue(0),
            'userId' => $this->integer()->notNull()->defaultValue(0),
            'isStudied' => $this->boolean()->notNull()->defaultValue(false),
            'isHidden' => $this->boolean()->notNull()->defaultValue(false),
        ]);

        $this->addForeignKey(
            'fk-content_attribute-contentId-content-id',
            'content_attribute',
            'contentId',
            'content',
            'id',
            'CASCADE',
            'CASCADE'
        );
        $this->addForeignKey(
            'fk-content_attribute-userId-users-id',
            'content_attribute',
            'userId',
            'users',
            'id',
            'CASCADE',
            'CASCADE'
        );

        $this->createIndex(
            'content_attribute-contentId-userId-uidx',
            'content_attribute',
            ['contentId', 'userId'],
            true
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropIndex('content_attribute-contentId-userId-uidx', 'content_attribute');
        $this->dropForeignKey('fk-content_attribute-userId-users-id', 'content_attribute');
        $this->dropForeignKey('fk-content_attribute-contentId-content-id', 'content_attribute');
        $this->dropTable('{{%content_attribute}}');
    }
}
