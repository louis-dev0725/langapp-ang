<?php

use yii\db\Migration;

/**
 * Class m210224_072420_add_index_to_content_table
 */
class m210224_072420_add_index_to_content_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->execute('CREATE INDEX "content_level_idx" ON "content" ("rank", "level") WHERE "status" = 1 AND "deleted" = 0;');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->execute('DROP INDEX "content_level_idx";');
    }
}
