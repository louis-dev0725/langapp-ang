<?php

use yii\db\Migration;

/**
 * Class m211105_013048_alter_content_report
 */
class m211105_013048_alter_content_report extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->dropForeignKey('fk-content_report-moderatorId-user-id', 'content_report');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
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
}
