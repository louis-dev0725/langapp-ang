<?php

use yii\db\Migration;

class m190407_200203_create_table_transactions extends Migration
{
    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%transactions}}', [
            'id' => $this->primaryKey(),
            'userId' => $this->integer()->notNull()->defaultValue('0'),
            'money' => $this->money()->notNull()->defaultValue('0'),
            'isCommon' => $this->smallInteger()->notNull()->defaultValue('0'),
            'comment' => $this->string()->notNull()->defaultValue(''),
            'addedDateTime' => $this->timestamp()->notNull(),
            'isPartner' => $this->smallInteger()->notNull()->defaultValue('0'),
            'isRealMoney' => $this->smallInteger()->notNull()->defaultValue('1'),
            'fromInvitedUserId' => $this->integer()->notNull()->defaultValue('0'),
            'parentTransactionId' => $this->integer()->notNull()->defaultValue('0'),
            'dataJson' => $this->json()->notNull()->defaultValue('[]'),
        ], $tableOptions);

        $this->createIndex(
            'transactions_userId_money_addedDateTime_isRealMoney_idx',
            '{{%transactions}}',
            ['userId', 'money', 'addedDateTime', 'isRealMoney']
        );
        $this->createIndex('transactions_userId_idx', '{{%transactions}}', 'userId');
        $this->createIndex('transactions_userId_money_idx', '{{%transactions}}', ['userId', 'money']);
        $this->createIndex('transactions_isCommon_idx', '{{%transactions}}', 'isCommon');
        $this->createIndex('transactions_addedDateTime_idx', '{{%transactions}}', 'addedDateTime');
        $this->createIndex('transactions_isPartner_idx', '{{%transactions}}', 'isPartner');
        $this->createIndex('transactions_isRealMoney_idx', '{{%transactions}}', 'isRealMoney');

        $this->addForeignKey(
            'transactions_users_fk',
            '{{%transactions}}',
            'userId',
            '{{%users}}',
            'id',
            'CASCADE',
            'NO ACTION'
        );
    }

    public function down()
    {
        $this->dropForeignKey('transactions_users_fk', '{{%transactions}}');

        $this->dropIndex('transactions_isRealMoney_idx', '{{%transactions}}');
        $this->dropIndex('transactions_isPartner_idx', '{{%transactions}}');
        $this->dropIndex('transactions_addedDateTime_idx', '{{%transactions}}');
        $this->dropIndex('transactions_isCommon_idx', '{{%transactions}}');
        $this->dropIndex('transactions_userId_money_idx', '{{%transactions}}');
        $this->dropIndex('transactions_userId_idx', '{{%transactions}}');
        $this->dropIndex('transactions_userId_money_addedDateTime_isRealMoney_idx', '{{%transactions}}');

        $this->dropTable('{{%transactions}}');
    }
}
