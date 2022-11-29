<?php

class m221029_070000_languages_data extends yii\db\Migration
{
    public function safeUp()
    {
        $this->truncateTable('{{%languages}}');

        $list = json_decode(file_get_contents(__DIR__ . '/../dump/languages_google_translate.json'), true);
        // Source https://github.com/mozilla/language-mapping-list/blob/master/language-mapping-list.js
        // $nativeList = json_decode(file_get_contents(__DIR__ . '/../dump/languages_mozilla.json'), true);
        // https://github.com/haliaeetus/iso-639/blob/master/data/iso_639-1.json
        $nativeList = json_decode(file_get_contents(__DIR__ . '/../dump/languages.json'), true);
        $code2to3 = json_decode(file_get_contents(__DIR__ . '/../dump/languages_code2to3.json'), true);

        // TODO: другой список для native list, в этом списке иногда с маленькой буквы и добавлено не нужное "язык" на конце

        $toInsert = [];
        $id = 0;
        foreach ($list as $code2) {
            $id++;
            if (isset($nativeList[$code2])) {
                $item = $nativeList[$code2];
                $titleNative = $item['nativeName'];
                if ($code2 != 'zh-CN' && $code2 != 'zh-TW') {
                    $titleNative = preg_replace('/\(.*?\)/', '', $titleNative);
                    $titleNative = preg_replace('/(\(|,).*$/', '', $titleNative);
                    $titleNative = trim($titleNative);
                }
                $title = preg_replace('/(\(|,).*$/', '', preg_replace('/\s*\(.*?\)\s*/', '', $item['nativeName']));
                $code3 = $item['639-2'];
                $titleEnglish = $item['name'];
            } else {
                $titleNative = '';
                $title = '';
                $code3 = '';
                $titleEnglish = '';
            }
            if ($titleNative != $title) {
                $title .= ' (' . $titleNative . ')';
            }
            $toInsert[] = ['code' => $code2, 'code3' => $code3, 'title' => $title, 'titleEnglish' => $titleEnglish, 'titleNative' => $titleNative];
        }
        usort($toInsert, function ($a, $b) {
            return $a['title'] <=> $b['title'];
        });
        Yii::$app->db->createCommand()->batchInsert('{{%languages}}', array_combine(array_keys($toInsert[0]), array_keys($toInsert[0])), $toInsert)->execute();
    }

    public function safeDown()
    {
        $this->truncateTable('{{%languages}}');
    }
}
