<?php

use yii\db\Migration;

class m190407_200202_create_table_users extends Migration
{
    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%users}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string()->notNull()->defaultValue(''),
            'company' => $this->string()->notNull()->defaultValue(''),
            'site' => $this->string()->notNull()->defaultValue(''),
            'telephone' => $this->string()->notNull()->defaultValue(''),
            'email' => $this->string()->notNull()->defaultValue(''),
            'passwordHash' => $this->string()->notNull()->defaultValue(''),
            'balance' => $this->money()->notNull()->defaultValue('0'),
            'balancePartner' => $this->money()->notNull()->defaultValue('0'),
            'paidUntilDateTime' => $this->timestamp()->notNull()->defaultValue('2000-01-01 00:00:00'),
            'registerIp' => $this->string()->notNull()->defaultValue('0'),
            'lastLoginIp' => $this->string()->notNull()->defaultValue('0'),
            'addedDateTime' => $this->timestamp()->notNull()->defaultValue('2000-01-01 00:00:00'),
            'updatedDateTime' => $this->timestamp()->notNull()->defaultValue('2000-01-01 00:00:00'),
            'comment' => $this->text()->notNull()->defaultValue(''),
            'resetPasswordToken' => $this->string()->notNull()->defaultValue(''),
            'passwordChangedDateTime' => $this->timestamp()->notNull()->defaultValue('2000-01-01 00:00:00'),
            'isServicePaused' => $this->smallInteger()->notNull()->defaultValue('0'),
            'invitedByUserId' => $this->integer()->notNull()->defaultValue('0'),
            'isPartner' => $this->smallInteger()->notNull()->defaultValue('1'),
            'enablePartnerPayments' => $this->smallInteger()->defaultValue('0'),
            'partnerPercent' => $this->money()->notNull()->defaultValue('0.3'),
            'partnerEarned' => $this->money()->notNull()->defaultValue('0'),
            'wmr' => $this->string()->notNull()->defaultValue(''),
            'dataJson' => $this->json()->notNull()->defaultValue('[]'),
            'timezone' => $this->string()->notNull()->defaultValue('Europe/Moscow'),
        ], $tableOptions);

        $this->createIndex('users_invitedByUserId_idx', '{{%users}}', 'invitedByUserId');
    }

    public function down()
    {
        $this->dropIndex('users_invitedByUserId_idx', '{{%users}}');

        $this->dropTable('{{%users}}');
    }
}
