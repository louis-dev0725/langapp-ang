<?php

use yii\db\Migration;

/**
 * Class m221207_055655_alter_timestamp_column
 */
class m221207_055655_alter_timestamp_column extends Migration
{
    protected $items = [
        '{{%users}}' => [
            'paidUntilDateTime',
            'addedDateTime',
            'updatedDateTime',
            'passwordChangedDateTime',
        ],
        '{{%audio}}' => [
            'addedDateTime',
        ],
        '{{%payment_methods}}' => [
            'addedDateTime',
        ],
    ];

    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $schema = $this->getDb()->getSchema();
        $type = $schema->createColumnSchemaBuilder('timestamptz')->notNull();
        $default = "SET DEFAULT '2000-01-01 00:00:00'";

        foreach ($this->items as $table => $columns) {
            foreach ($columns as $column) {
                $this->alterColumn($table, $column, $type);
                $this->alterColumn($table, $column, $default);
            }
        }
        $this->alterColumn('{{%transactions}}', 'addedDateTime', $type);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $type = $this->timestamp()->notNull();
        $default = "SET DEFAULT '2000-01-01 00:00:00'";

        foreach ($this->items as $table => $columns) {
            foreach ($columns as $column) {
                $this->alterColumn($table, $column, $type);
                $this->alterColumn($table, $column, $default);
            }
        }
        $this->alterColumn('{{%transactions}}', 'addedDateTime', $type);
    }
}
