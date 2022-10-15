<?php

class m221015_070000_content_data extends \app\components\DataMigration
{
    public function init()
    {
        $this->execute('truncate table content_category cascade;');
        $this->execute('truncate table category cascade;');
        $this->tableName = 'content';
        parent::init();
    }
}
