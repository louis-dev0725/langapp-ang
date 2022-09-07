<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `{{%drill_review}}`.
 */
class m220906_052654_create_drill_review_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%drill_review}}', [
            'id' => $this->primaryKey(),
            'userWordId' => $this->integer()->notNull(),
            'date' => $this->getDb()->getSchema()->createColumnSchemaBuilder('timestamptz')->notNull()->defaultValue('2000-01-01 00:00:00'),
            'answer' => $this->integer()->notNull()->defaultValue(0),
            'oldInterval' => $this->integer()->notNull()->defaultValue(0),
            'oldEaseFactor' => $this->float()->notNull()->defaultValue(0),
            'newInterval' => $this->integer()->notNull()->defaultValue(0),
            'newEaseFactor' => $this->float()->notNull()->defaultValue(0),
            'drills' => $this->getDb()->getSchema()->createColumnSchemaBuilder('jsonb')->notNull()->defaultValue('[]'),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%drill_review}}');
    }
}
