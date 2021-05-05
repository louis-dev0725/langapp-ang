<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding columns to table `{{%setting_plugin}}`.
 */
class m200706_101733_add_extensionSubtitleTranslate_column_to_setting_plugin_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn(
            '{{%setting_plugin}}',
            'extensionSubtitleTranslate',
            Schema::TYPE_BOOLEAN . ' NOT NULL DEFAULT TRUE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%setting_plugin}}', 'extensionSubtitleTranslate');
    }
}
