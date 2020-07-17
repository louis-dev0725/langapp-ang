<?php

use yii\db\Migration;

/**
 * Handles adding invoiceId to table `{{%transactions}}`.
 */
class m190413_213555_add_invoiceId_column_to_transactions_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%transactions}}', 'invoiceId', $this->integer()->notNull()->defaultValue('0'));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%transactions}}', 'invoiceId');
    }
}
