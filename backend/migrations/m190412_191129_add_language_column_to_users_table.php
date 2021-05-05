<?php

use yii\db\Migration;

/**
 * Handles adding language to table `{{%users}}`.
 */
class m190412_191129_add_language_column_to_users_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%users}}', 'language', $this->string()->notNull()->defaultValue('ru-RU'));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%users}}', 'language');
    }
}
