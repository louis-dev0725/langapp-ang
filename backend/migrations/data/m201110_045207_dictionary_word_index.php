<?php

use yii\db\Migration;

/**
 * Class m201110_045207_dictionary_word_index
 */
class m201110_045207_dictionary_word_index extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->execute('CREATE INDEX dictionary_word_query_idx ON public.dictionary_word USING gin (query);');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->execute('DROP INDEX "dictionary_word_query_idx";');
    }
}
