<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m200231_061416_create_dictionary_word_table
 */
class m200231_061416_create_dictionary_word_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%dictionary_word}}', [
            'id' => Schema::TYPE_PK,
            'dictionary' => Schema::TYPE_SMALLINT . ' NOT NULL DEFAULT 0',
            'idInDictionary' => Schema::TYPE_INTEGER . ' NOT NULL DEFAULT 0',
            'query' => 'text[] NOT NULL DEFAULT \'{}\'::text[]',
            'sourceData' => 'jsonb NOT NULL DEFAULT \'{}\'::jsonb',
        ]);

        $this->execute('CREATE INDEX dictionary_word_pgroonga_index ON public.dictionary_word USING pgroonga (query pgroonga_text_array_term_search_ops_v2);');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%dictionary_word}}');
    }
}
