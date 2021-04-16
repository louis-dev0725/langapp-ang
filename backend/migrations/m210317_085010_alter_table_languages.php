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
        $this->truncateTable('{{%languages}}');
        // Source https://github.com/haliaeetus/iso-639/blob/master/data/iso_639-1.json
        $list = json_decode(file_get_contents(__DIR__ . '/dump/languages.json'), true);
        $toInsert = [];
        $id = 0;
        foreach ($list as $item) {
            $id++;
            $code = $item['639-1'];
            $titleNative = trim(preg_replace('/(\(|,).*$/', '', $item['nativeName']));
            $title = preg_replace('/(\(|,).*$/', '', preg_replace('/\s*\(.*?\)\s*/', '', $item['name']));
            if (!in_array($code, ['ie']) && $titleNative != $title) {
                $title .= ' (' . $titleNative . ')';
            }
            if (!in_array($code, ['nb', 'nn'])) {
                $toInsert[] = ['code' => $code, 'code3' => $item['639-2'], 'title' => $title, 'titleEnglish' => $item['name'], 'titleNative' => $titleNative];
            }
        }
        usort($toInsert, function($a, $b) {
            return $a['title'] <=> $b['title'];
        });
        Yii::$app->db->createCommand()->batchInsert('{{%languages}}', array_combine(array_keys($toInsert[0]), array_keys($toInsert[0])), $toInsert)->execute();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%languages}}', 'code3');
        $this->dropColumn('{{%languages}}', 'titleNative');
        $this->dropColumn('{{%languages}}', 'titleEnglish');
        $this->truncateTable('{{%languages}}');
    }
}
