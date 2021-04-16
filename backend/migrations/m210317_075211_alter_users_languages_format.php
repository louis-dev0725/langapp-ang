<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m210317_075211_alter_users_languages_format
 */
class m210317_075211_alter_users_languages_format extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->dropForeignKey('{{%fk-users-main_language}}', '{{%users}}');
        $this->dropForeignKey('{{%fk-users-language1}}', '{{%users}}');
        $this->dropForeignKey('{{%fk-users-language2}}', '{{%users}}');
        $this->dropForeignKey('{{%fk-users-language3}}', '{{%users}}');
        $this->dropColumn('{{%users}}', 'main_language');
        $this->dropColumn('{{%users}}', 'language1');
        $this->dropColumn('{{%users}}', 'language2');
        $this->dropColumn('{{%users}}', 'language3');

        $this->execute('ALTER TABLE "users" ADD "languages" jsonb NOT NULL DEFAULT \'[]\'');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m210317_075211_alter_users_languages_format cannot be reverted.\n";

        return false;
    }
}
