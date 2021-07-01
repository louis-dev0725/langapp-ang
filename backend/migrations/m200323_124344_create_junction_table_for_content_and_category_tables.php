<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%content_category}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%content}}`
 * - `{{%category}}`
 */
class m200323_124344_create_junction_table_for_content_and_category_tables extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%content_category}}', [
            'content_id' => $this->integer(),
            'category_id' => $this->integer(),
            'PRIMARY KEY(content_id, category_id)',
        ]);

        // creates index for column `content_id`
        $this->createIndex(
            '{{%idx-content_category-content_id}}',
            '{{%content_category}}',
            'content_id'
        );

        // add foreign key for table `{{%content}}`
        $this->addForeignKey(
            '{{%fk-content_category-content_id}}',
            '{{%content_category}}',
            'content_id',
            '{{%content}}',
            'id',
            'CASCADE',
            'NO ACTION'
        );

        // creates index for column `category_content_id`
        $this->createIndex(
            '{{%idx-content_category-category_id}}',
            '{{%content_category}}',
            'category_id'
        );

        // add foreign key for table `{{%category_content}}`
        $this->addForeignKey(
            '{{%fk-content_category-category_id}}',
            '{{%content_category}}',
            'category_id',
            '{{%category}}',
            'id',
            'CASCADE',
            'NO ACTION'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        // drops foreign key for table `{{%content}}`
        $this->dropForeignKey('{{%fk-content_category-content_id}}', '{{%content_category}}');

        // drops index for column `content_id`
        $this->dropIndex('{{%idx-content_category-content_id}}', '{{%content_category}}');

        // drops foreign key for table `{{%category_content}}`
        $this->dropForeignKey('{{%fk-content_category-category_id}}', '{{%content_category}}');

        // drops index for column `category_content_id`
        $this->dropIndex('{{%idx-content_category-category_id}}', '{{%content_category}}');

        $this->dropTable('{{%content_category}}');
    }
}
