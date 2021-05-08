<?php

namespace app\controllers;

use yii\helpers\Console;
use yii\helpers\FileHelper;
use yii\i18n\GettextPoFile;

class MessageController extends \yii\console\controllers\MessageController
{
    /**
     * Changes from original: support disabling sort.
     *
     * Writes messages into POT file.
     *
     * @param array $messages
     * @param string $dirName name of the directory to write to
     * @param string $catalog message catalog
     * @since 2.0.6
     */
    protected function saveMessagesToPOT($messages, $dirName, $catalog)
    {
        $file = str_replace('\\', '/', "$dirName/$catalog.pot");
        FileHelper::createDirectory(dirname($file));
        $this->stdout("Saving messages to $file...\n");

        $poFile = new GettextPoFile();

        $merged = [];

        $hasSomethingToWrite = false;
        foreach ($messages as $category => $msgs) {
            $msgs = array_values(array_unique($msgs));

            if ($this->config['sort']) {
                sort($msgs);
            }
            foreach ($msgs as $message) {
                $merged[$category . chr(4) . $message] = '';
            }
            $this->stdout("Category \"$category\" merged.\n");
            $hasSomethingToWrite = true;
        }
        if ($hasSomethingToWrite) {
            if ($this->config['sort']) {
                ksort($merged);
            }
            $poFile->save($file, $merged);
            $this->stdout("Translation saved.\n", Console::FG_GREEN);
        } else {
            $this->stdout("Nothing to save.\n", Console::FG_GREEN);
        }
    }
}
