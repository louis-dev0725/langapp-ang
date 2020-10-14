<?php

use yii\db\Migration;

/**
 * Handles adding currency to table `{{%transactions}}`.
 */
class m190806_194438_add_currency_column_to_transactions_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%transactions}}', 'currency', $this->string()->notNull()->defaultValue('RUB'));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%transactions}}', 'currency');
    }
}
