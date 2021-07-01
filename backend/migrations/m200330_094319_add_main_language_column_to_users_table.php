<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding main_language to table `{{%users}}`.
 */
class m200330_094319_add_main_language_column_to_users_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%users}}', 'main_language', Schema::TYPE_INTEGER . ' NULL');
        $this->addColumn('{{%users}}', 'language1', Schema::TYPE_INTEGER . ' NULL');
        $this->addColumn('{{%users}}', 'language2', Schema::TYPE_INTEGER . ' NULL');
        $this->addColumn('{{%users}}', 'language3', Schema::TYPE_INTEGER . ' NULL');

        $this->addForeignKey(
            '{{%fk-users-main_language}}',
            '{{%users}}',
            'main_language',
            '{{%languages}}',
            'id',
            'SET NULL',
            'NO ACTION'
        );

        $this->addForeignKey(
            '{{%fk-users-language1}}',
            '{{%users}}',
            'language1',
            '{{%languages}}',
            'id',
            'SET NULL',
            'NO ACTION'
        );

        $this->addForeignKey(
            '{{%fk-users-language2}}',
            '{{%users}}',
            'language2',
            '{{%languages}}',
            'id',
            'SET NULL',
            'NO ACTION'
        );

        $this->addForeignKey(
            '{{%fk-users-language3}}',
            '{{%users}}',
            'language3',
            '{{%languages}}',
            'id',
            'SET NULL',
            'NO ACTION'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('{{%fk-users-language3}}', '{{%users}}');
        $this->dropForeignKey('{{%fk-users-language2}}', '{{%users}}');
        $this->dropForeignKey('{{%fk-users-language1}}', '{{%users}}');
        $this->dropForeignKey('{{%fk-users-main_language}}', '{{%users}}');

        $this->dropColumn('{{%users}}', 'language3');
        $this->dropColumn('{{%users}}', 'language2');
        $this->dropColumn('{{%users}}', 'language1');
        $this->dropColumn('{{%users}}', 'main_language');
    }
}
