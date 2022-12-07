<?php

use app\enums\UserTariff;
use yii\db\Migration;

/**
 * Class m221205_143339_add_penalty_tariff_to_user
 */
class m221205_143339_add_penalty_tariff_to_user extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%users}}', 'penaltyAmount', $this->money()->defaultValue(100));
        $this->addColumn('{{%users}}', 'tariff', $this->string()->defaultValue(UserTariff::FREE));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%users}}', 'penaltyAmount');
        $this->dropColumn('{{%users}}', 'tariff');
    }
}
