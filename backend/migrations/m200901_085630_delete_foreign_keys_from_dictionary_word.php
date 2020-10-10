<?php

use yii\db\Migration;

/**
 * Class m200901_085630_delete_foreign_keys_from_dictionary_word
 */
class m200901_085630_delete_foreign_keys_from_dictionary_word extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->dropForeignKey('user_dictionary_dictionary_word_fk', '{{%user_dictionary}}');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->addForeignKey('user_dictionary_dictionary_word_fk', '{{%user_dictionary}}', 'dictionary_word_id', '{{%dictionary_word}}', 'id', 'CASCADE', 'NO ACTION');
    }
}
