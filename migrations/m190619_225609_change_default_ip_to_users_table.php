<?php

use yii\db\Migration;

/**
 * Class m190619_225609_change_default_ip_to_users_table
 */
class m190619_225609_change_default_ip_to_users_table extends Migration
{
    public function up()
    {
        //$this->alterColumn('users', 'registerIp', $this->string()->defaultValue(''));
        $this->execute('alter table users alter column "registerIp" set default \'\';');
        //$this->alterColumn('users', 'lastLoginIp', $this->string()->defaultValue(''));
        $this->execute('alter table users alter column "lastLoginIp" set default \'\';');
    }

    public function down()
    {
        echo "m190619_225609_change_default_ip_to_users_table cannot be reverted.\n";

        return false;
    }
}
