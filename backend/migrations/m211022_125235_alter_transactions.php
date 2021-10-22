<?php

use yii\db\Migration;

/**
 * Class m211022_125235_alter_transactions
 */
class m211022_125235_alter_transactions extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->dropForeignKey('fk-transactions-paymentMethodId-payment_methods-id', 'transactions');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->addForeignKey(
            'fk-transactions-paymentMethodId-payment_methods-id',
            'transactions',
            'paymentMethodId',
            'payment_methods',
            'id',
            'CASCADE',
            'NO ACTION'
        );
    }
}
