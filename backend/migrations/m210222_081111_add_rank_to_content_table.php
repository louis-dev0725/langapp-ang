<?php

use yii\db\Migration;

/**
 * Class m210222_081111_add_rank_to_content_table
 */
class m210222_081111_add_rank_to_content_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%content}}', 'rank', $this->integer());
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%content}}', 'rank');

        return false;
    }
}
