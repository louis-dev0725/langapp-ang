<?php

class m221015_070000_content_data extends \app\components\DataMigration
{
    public function init()
    {
        $this->tableName = 'content';
        parent::init();
    }

    public function up() {
        $this->execute('truncate table content_category cascade;');
        $this->execute('truncate table category cascade;');
        parent::up();
    }

    public function safeDown() {
        $this->execute('truncate table content_category cascade;');
        $this->execute('truncate table category cascade;');
        parent::safeDown();
    }
}
