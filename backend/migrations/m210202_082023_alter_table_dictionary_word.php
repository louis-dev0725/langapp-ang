<?php

use yii\db\Migration;

/**
 * Class m210202_082023_alter_table_dictionary_word
 */
class m210202_082023_alter_table_dictionary_word extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->execute('ALTER TABLE "dictionary_word" DROP COLUMN "dictionary"');
        $this->execute('ALTER TABLE "dictionary_word" DROP COLUMN "idInDictionary"');
        $this->execute('ALTER TABLE "dictionary_word" DROP COLUMN "sourceData"');
        $this->execute('ALTER TABLE "dictionary_word" ADD "type" smallint NOT NULL DEFAULT 0');
        $this->execute('ALTER TABLE "dictionary_word" ADD "data" jsonb NOT NULL DEFAULT \'{}\'');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->execute('ALTER TABLE "dictionary_word" DROP COLUMN "data"');
        $this->execute('ALTER TABLE "dictionary_word" DROP COLUMN "type"');
        $this->execute('ALTER TABLE "dictionary_word" ADD "sourceData" jsonb NOT NULL DEFAULT \'{}\'');
        $this->execute('ALTER TABLE "dictionary_word" ADD "idInDictionary" integer NOT NULL DEFAULT 0');
        $this->execute('ALTER TABLE "dictionary_word" ADD "dictionary" smallint NOT NULL DEFAULT 0');
    }
}
