<?php

use yii\db\Migration;

/**
 * Class m200901_071244_dictionary_word
 */
class m200901_071244_dictionary_word extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function up()
    {
        $this->truncateTable('dictionary_word');

        preg_match('/host=(.*?)(;|$)/', $this->db->dsn, $matches);
        $host = $matches[1];
        preg_match('/dbname=(.*?)(;|$)/', $this->db->dsn, $matches);
        $dbname = $matches[1];

        $command = 'PGPASSWORD=' . escapeshellarg($this->db->password) . ' pg_restore --host=' . escapeshellarg($host) . ' --username=' . escapeshellarg($this->db->username) . ' --dbname=' . escapeshellarg($dbname) . ' --verbose --single-transaction ' . escapeshellarg(__DIR__ . '/dictionary_word.pgdata') . '';
        Yii::debug('Execute command ' . $command);
        exec($command, $result, $exitStatus);

        if ($exitStatus != 0) {
            throw new \yii\db\Exception('Unable to restore dump. See the error above.');
        }
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->truncateTable('dictionary_word');
    }
}
