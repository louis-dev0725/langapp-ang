<?php

use yii\db\Migration;

/**
 * Class m200231_061216_enable_pgroonga
 */
class m200231_061216_enable_pgroonga extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $isInstalled = $this->db->createCommand('SELECT * FROM pg_extension where extname = \'pgroonga\';')->queryOne();
        if ($isInstalled == null) {
            $isExists = $this->db->createCommand('SELECT * FROM pg_available_extensions where name = \'pgroonga\';')->queryOne();
            if ($isExists == null) {
                throw new \yii\base\Exception('pgroonga extension for PostgreSQL is not installed. You should install it and try again: https://pgroonga.github.io/install/');
            }
            $this->execute('create extension pgroonga;');
        }
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->execute('drop extension pgroonga;');
    }
}
