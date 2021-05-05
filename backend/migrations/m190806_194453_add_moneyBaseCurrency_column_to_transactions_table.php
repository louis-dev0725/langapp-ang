<?php

use yii\db\Migration;

/**
 * Handles adding moneyBaseCurrency to table `{{%transactions}}`.
 */
class m190806_194453_add_moneyBaseCurrency_column_to_transactions_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%transactions}}', 'moneyBaseCurrency', $this->money()->notNull()->defaultValue('0'));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%transactions}}', 'moneyBaseCurrency');
    }
}
