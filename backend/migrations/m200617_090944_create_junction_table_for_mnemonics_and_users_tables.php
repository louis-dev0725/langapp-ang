<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%mnemonics_users}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%mnemonics}}`
 * - `{{%users}}`
 */
class m200617_090944_create_junction_table_for_mnemonics_and_users_tables extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%mnemonics_users}}', [
            'mnemonics_id' => $this->integer(),
            'users_id' => $this->integer(),
            'rating' => $this->integer(),
            'PRIMARY KEY(mnemonics_id, users_id)',
        ]);

        // creates index for column `mnemonics_id`
        $this->createIndex(
            '{{%idx-mnemonics_users-mnemonics_id}}',
            '{{%mnemonics_users}}',
            'mnemonics_id'
        );

        // add foreign key for table `{{%mnemonics}}`
        $this->addForeignKey(
            '{{%fk-mnemonics_users-mnemonics_id}}',
            '{{%mnemonics_users}}',
            'mnemonics_id',
            '{{%mnemonics}}',
            'id',
            'CASCADE'
        );

        // creates index for column `users_id`
        $this->createIndex(
            '{{%idx-mnemonics_users-users_id}}',
            '{{%mnemonics_users}}',
            'users_id'
        );

        // add foreign key for table `{{%users}}`
        $this->addForeignKey(
            '{{%fk-mnemonics_users-users_id}}',
            '{{%mnemonics_users}}',
            'users_id',
            '{{%users}}',
            'id',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        // drops foreign key for table `{{%mnemonics}}`
        $this->dropForeignKey(
            '{{%fk-mnemonics_users-mnemonics_id}}',
            '{{%mnemonics_users}}'
        );

        // drops index for column `mnemonics_id`
        $this->dropIndex(
            '{{%idx-mnemonics_users-mnemonics_id}}',
            '{{%mnemonics_users}}'
        );

        // drops foreign key for table `{{%users}}`
        $this->dropForeignKey(
            '{{%fk-mnemonics_users-users_id}}',
            '{{%mnemonics_users}}'
        );

        // drops index for column `users_id`
        $this->dropIndex(
            '{{%idx-mnemonics_users-users_id}}',
            '{{%mnemonics_users}}'
        );

        $this->dropTable('{{%mnemonics_users}}');
    }
}
