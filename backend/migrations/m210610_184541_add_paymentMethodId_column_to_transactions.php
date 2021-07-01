<?php

use yii\db\Migration;

/**
 * Class m210610_184541_add_paymentMethodId_column_to_transactions
 */
class m210610_184541_add_paymentMethodId_column_to_transactions extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('transactions', 'paymentMethodId', $this->integer()->notNull()->defaultValue(0));
        $this->addForeignKey(
            'fk-transactions-paymentMethodId-payment_methods-id',
            'transactions',
            'paymentMethodId',
            'payment_methods',
            'id',
            'CASCADE',
            'NO ACTION'
        );
        $this->addColumn('transactions', 'status', $this->integer()->notNull()->defaultValue(1));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('transactions', 'status');
        $this->dropForeignKey('fk-transactions-paymentMethodId-payment_methods-id', 'transactions');
        $this->dropColumn('transactions', 'paymentMethodId');
    }
}
