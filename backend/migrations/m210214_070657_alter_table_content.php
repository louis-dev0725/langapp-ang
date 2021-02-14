<?php

use yii\db\Migration;

/**
 * Class m210214_070657_alter_table_content
 */
class m210214_070657_alter_table_content extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->execute('ALTER TABLE content RENAME COLUMN type_content TO "type";');
        $this->execute('ALTER TABLE content RENAME COLUMN source_link TO "sourceLink";');
        $this->execute('ALTER TABLE content RENAME COLUMN count_symbol TO "length";');
        $this->execute('ALTER TABLE content RENAME COLUMN "level_JLPT" TO "level";');
        $this->execute('update content set "level" = -1 where "level" = \'\';');
        $this->execute('ALTER TABLE content ALTER COLUMN "level" TYPE int2 USING "level"::int2;');
        $this->execute('ALTER TABLE content ALTER COLUMN "level" set default -1;');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->execute('ALTER TABLE content RENAME COLUMN "contentType" TO type_content;');
        $this->execute('ALTER TABLE content RENAME COLUMN "sourceLink" TO source_link;');
        $this->execute('ALTER TABLE content RENAME COLUMN "contentLength" TO count_symbol;');
        $this->execute('ALTER TABLE content RENAME COLUMN "level" TO "level_JLPT";');
        $this->execute('ALTER TABLE content ALTER COLUMN "level" TYPE string USING "level"::string;');
    }
}
