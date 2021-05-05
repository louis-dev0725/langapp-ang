<?php

use yii\db\Migration;

class m190407_200204_create_table_invoices extends Migration
{
    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%invoices}}', [
            'id' => $this->primaryKey(),
            'userId' => $this->integer()->notNull(),
        ], $tableOptions);

        $this->addForeignKey(
            'invoices_users_fk',
            '{{%invoices}}',
            'userId',
            '{{%users}}',
            'id',
            'CASCADE',
            'NO ACTION'
        );
    }

    public function down()
    {
        $this->dropTable('{{%invoices}}');
    }
}
