<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%payment_methods}}`.
 */
class m210513_060403_create_payment_methods_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%payment_methods}}', [
            'id' => $this->primaryKey(),
            'userId' => $this->integer()->notNull(),
            'type' => $this->string()->notNull(),
            'title' => $this->string()->defaultValue('')->notNull(),
            'isActive' => $this->boolean()->defaultValue(true)->notNull(),
            'isDeleted' => $this->boolean()->defaultValue(false)->notNull(),
            'addedDateTime' => $this->timestamp()->defaultValue('2000-01-01 00:00:00')->notNull(),
            'data' => $this->getDb()->getSchema()->createColumnSchemaBuilder('jsonb')->defaultValue('{}')->notNull(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%payment_methods}}');
    }
}
