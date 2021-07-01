<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `{{%languages}}`.
 */
class m200330_084319_create_languages_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%languages}}', [
            'id' => Schema::TYPE_PK,
            'title' => Schema::TYPE_STRING . ' NOT NULL',
        ]);

        Yii::$app->db->createCommand()->batchInsert('{{%languages}}', ['title'], [
            ['Русский'], ['Английский'], ['Японский'], ['Китайский'], ['Хинди'], ['Испанский'], ['Арабский'],
            ['Бенгальский'], ['Португальский'], ['Индонезийский'], ['Французский'], ['Итальянский'],
        ])->execute();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%languages}}');
    }
}
