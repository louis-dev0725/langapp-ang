<?php

use yii\db\Migration;

class m211130_070000_content_data extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function up()
    {
        $loadTestData = isset($_SERVER['LOAD_TEST_DATA']) && $_SERVER['LOAD_TEST_DATA'] == '1';
        if ($loadTestData) {
            $this->execute('truncate table content cascade;');

            preg_match('/host=(.*?)(;|$)/', $this->db->dsn, $matches);
            $host = $matches[1];
            preg_match('/dbname=(.*?)(;|$)/', $this->db->dsn, $matches);
            $dbname = $matches[1];

            $testDataUrl = isset($_SERVER['TEST_DATA_URL']) ? $_SERVER['TEST_DATA_URL'] : 'http://langapp.lb7.ru/internal-8f348g47f39/';
            $url = $testDataUrl . 'content_dev.pgdata';

            $command = 'curl ' . escapeshellarg($url) . ' | ' . 'PGPASSWORD=' . escapeshellarg($this->db->password) . ' pg_restore --host=' . escapeshellarg($host) . ' --username=' . escapeshellarg($this->db->username) . ' --dbname=' . escapeshellarg($dbname) . ' --verbose --single-transaction';
            Yii::debug('Execute command ' . $command);
            exec($command, $result, $exitStatus);

            if ($exitStatus != 0) {
                throw new \yii\db\Exception('Unable to restore dump. See the error above.');
            }
        }
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->truncateTable('content');
    }
}
