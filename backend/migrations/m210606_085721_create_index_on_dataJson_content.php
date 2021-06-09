<?php

use yii\db\Migration;

/**
 * Class m210606_085721_create_index_on_dataJson_content
 */
class m210606_085721_create_index_on_dataJson_content extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->execute('CREATE INDEX "content_dataJson_idx" ON "content" USING GIN ("dataJson" jsonb_path_ops);');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropIndex('content_dataJson_idx', 'content');
    }
}
