<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `{{%setting_plugin}}`.
 */
class m200424_115753_create_setting_plugin_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%setting_plugin}}', [
            'id' => Schema::TYPE_PK,
            'user_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'extensionShowTranslate' => Schema::TYPE_STRING . ' NOT NULL',
        ]);

        $this->addForeignKey(
            'setting_plugin_users_fk',
            '{{%setting_plugin}}',
            'user_id',
            '{{%users}}',
            'id',
            'CASCADE',
            'NO ACTION'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('setting_plugin_users_fk', '{{%setting_plugin}}');

        $this->dropTable('{{%setting_plugin}}');
    }
}
