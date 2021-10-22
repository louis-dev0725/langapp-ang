<?php

use yii\db\Migration;

/**
 * Class m211022_054816_alter_users_language_column
 */
class m211022_054816_alter_users_language_column extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->alterColumn('{{%users}}', 'language', $this->string()->notNull()->defaultValue('en'));
    }
    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->alterColumn('{{%users}}', 'language', $this->string()->notNull()->defaultValue('ru-RU'));
    }
}
