<?php

use yii\db\Migration;

/**
 * Handles adding columns to table `{{%content}}`.
 */
class m201228_041740_add_format_column_to_content_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%content}}', 'format', $this->string()->notNull()->defaultValue('text'));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%content}}', 'format');
    }
}
