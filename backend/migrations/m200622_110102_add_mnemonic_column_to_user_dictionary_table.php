<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding columns to table `{{%user_dictionary}}`.
 */
class m200622_110102_add_mnemonic_column_to_user_dictionary_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%user_dictionary}}', 'mnemonic_id', Schema::TYPE_INTEGER . ' NULL DEFAULT NULL');

        $this->addForeignKey(
            'fk-mnemonic-mnemonics_id',
            '{{%user_dictionary}}',
            'mnemonic_id',
            '{{%mnemonics}}',
            'id',
            'SET NULL'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('fk-mnemonic-mnemonics_id', '{{%user_dictionary}}');

        $this->dropColumn('{{%user_dictionary}}', 'mnemonic_id');
    }
}
