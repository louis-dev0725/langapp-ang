<?php

namespace app\components;

use Yii;
use yii\db\Migration;

class DataMigration extends Migration
{
    /**
     * @var string
     */
    public $tableName;

    /**
     * {@inheritdoc}
     */
    public function up()
    {
        $migrationSuffix = '%' . preg_replace('/^.*m\d{6,}_\d{6,}/', '', get_class($this));

        // Delete old migrations
        $this->execute('delete from migration_data where "version" like :suffix;', [':suffix' => $migrationSuffix]);

        // Clean table
        $this->execute('truncate table ' . $this->db->quoteTableName($this->tableName) . ' cascade;');

        // Load from remote dump
        preg_match('/host=(.*?)(;|$)/', $this->db->dsn, $matches);
        $host = $matches[1];
        preg_match('/dbname=(.*?)(;|$)/', $this->db->dsn, $matches);
        $dbname = $matches[1];

        $testDataUrl = isset($_SERVER['TEST_DATA_URL']) ? $_SERVER['TEST_DATA_URL'] : 'http://langapp.lb7.ru/internal-8f348g47f39/';
        $url = $testDataUrl . $this->tableName . '.pgdata';

        $command = 'curl ' . escapeshellarg($url) . ' | ' . 'PGPASSWORD=' . escapeshellarg($this->db->password) . ' pg_restore --host=' . escapeshellarg($host) . ' --username=' . escapeshellarg($this->db->username) . ' --dbname=' . escapeshellarg($dbname) . ' --verbose --single-transaction --exit-on-error';
        echo 'Execute: ' . $command . "\n";
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
        $this->execute('truncate table ' . $this->db->quoteTableName($this->tableName) . ' cascade;');
    }
}