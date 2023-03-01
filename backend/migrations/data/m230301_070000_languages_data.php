<?php

class m230301_070000_languages_data extends yii\db\Migration
{
    public function safeUp()
    {
        $this->execute('delete from migration_data where "version" like :suffix;', [':suffix' => '%_languages_data']);
        $this->truncateTable('{{%languages}}');

        $googleList = json_decode(file_get_contents(__DIR__ . '/../dump/languages_google_translate.json'), true);

        // Source https://github.com/haliaeetus/iso-639/blob/master/data/iso_639-1.json
        $isoList = json_decode(file_get_contents(__DIR__ . '/../dump/languages_iso_639.json'), true);

        // Source https://github.com/wikimedia/mediawiki/blob/2c9b5880ca19389f5fa4f57104d7bea8ced88c67/includes/languages/data/Names.php
        $mediaWikiList = json_decode(file_get_contents(__DIR__ . '/../dump/languages_mediawiki.json'), true);

        $toInsert = [];
        $id = 0;
        foreach ($googleList as $code2) {
            $id++;
            if ($code2 == 'mni-Mtei') {
                $code2 = 'mni';
            }

            if (isset($mediaWikiList[strtolower($code2)])) {
                $titleNative = $mediaWikiList[strtolower($code2)];
            } else {
                $titleNative = '';
                echo "Unable to find lang $code2 in mediaWikiList\n";
                continue;
            }

            if (isset($isoList[$code2])) {
                $item = $isoList[$code2];
                $code3 = $item['639-2'];
                $titleEnglish = $item['name'];
            } else {
                // echo "Unable to find lang $code2 in isoList\n";
                $titleEnglish = '';
            }
            $title = mb_strtoupper(mb_substr($titleNative, 0, 1)) . mb_substr($titleNative, 1);
            if ($titleEnglish != '' && $title != $titleEnglish) {
                $title .= ' (' . $titleEnglish . ')';
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
