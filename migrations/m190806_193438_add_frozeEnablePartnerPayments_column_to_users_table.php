<?php

use yii\db\Migration;

/**
 * Handles adding enablePartnerPaymentsFrozen to table `{{%users}}`.
 */
class m190806_193438_add_frozeEnablePartnerPayments_column_to_users_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%users}}', 'frozeEnablePartnerPayments', $this->smallInteger()->defaultValue('0'));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%users}}', 'frozeEnablePartnerPayments');
    }
}
