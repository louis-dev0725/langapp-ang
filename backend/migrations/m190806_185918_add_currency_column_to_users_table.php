<?php

use yii\db\Migration;

/**
 * Handles adding currency to table `{{%users}}`.
 */
class m190806_185918_add_currency_column_to_users_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%users}}', 'currency', $this->string()->notNull()->defaultValue('RUB'));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%users}}', 'currency');
    }
}
