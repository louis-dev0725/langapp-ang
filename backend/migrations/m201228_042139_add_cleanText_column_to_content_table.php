<?php

use yii\db\Migration;

/**
 * Handles adding columns to table `{{%content}}`.
 */
class m201228_042139_add_cleanText_column_to_content_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%content}}', 'cleanText', $this->text());
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%content}}', 'cleanText');
    }
}
