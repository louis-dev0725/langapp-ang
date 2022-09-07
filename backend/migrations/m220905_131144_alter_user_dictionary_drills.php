<?php

use yii\db\Migration;
use yii\db\pgsql\Schema;

/**
 * Class m220905_131144_alter_user_dictionary_drills
 */
class m220905_131144_alter_user_dictionary_drills extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->dropColumn('user_dictionary', 'workout_progress_card');
        $this->dropColumn('user_dictionary', 'success_training');
        $this->dropColumn('user_dictionary', 'number_training');
        $this->dropColumn('user_dictionary', 'workout_progress_word_translate');
        $this->addColumn('user_dictionary', 'drill_card', $this->getDb()->getSchema()->createColumnSchemaBuilder('jsonb')->notNull()->defaultValue('{}'));
        $this->addColumn('user_dictionary', 'drill_progress', $this->integer()->notNull()->defaultValue(0));
        $this->addColumn('user_dictionary', 'drill_due', $this->getDb()->getSchema()->createColumnSchemaBuilder('timestamptz')->notNull()->defaultValue('2000-01-01 00:00:00+00'));
        $this->addColumn('user_dictionary', 'drill_last', $this->getDb()->getSchema()->createColumnSchemaBuilder('timestamptz')->notNull()->defaultValue('2000-01-01 00:00:00+00'));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('user_dictionary', 'drill_card');
        $this->dropColumn('user_dictionary', 'drill_progress');
        $this->dropColumn('user_dictionary', 'drill_due');
        $this->addColumn('user_dictionary', 'success_training', Schema::TYPE_INTEGER . ' NOT NULL DEFAULT 0');
        $this->addColumn('user_dictionary', 'number_training', Schema::TYPE_INTEGER . ' NOT NULL DEFAULT 0');
        $this->addColumn('user_dictionary', 'workout_progress_card', Schema::TYPE_JSON . " NOT NULL DEFAULT '[]'");
        $this->addColumn('user_dictionary', 'workout_progress_word_translate', Schema::TYPE_JSON . " NOT NULL DEFAULT '[]'");
    }
}
