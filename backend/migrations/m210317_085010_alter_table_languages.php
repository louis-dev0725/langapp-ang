<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m210317_085010_alter_table_languages
 */
class m210317_085010_alter_table_languages extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%languages}}', 'code3', Schema::TYPE_STRING . ' NULL');
        $this->addColumn('{{%languages}}', 'titleNative', Schema::TYPE_STRING . ' NULL');
        $this->addColumn('{{%languages}}', 'titleEnglish', Schema::TYPE_STRING . ' NULL');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%languages}}', 'code3');
        $this->dropColumn('{{%languages}}', 'titleNative');
        $this->dropColumn('{{%languages}}', 'titleEnglish');
    }
}
