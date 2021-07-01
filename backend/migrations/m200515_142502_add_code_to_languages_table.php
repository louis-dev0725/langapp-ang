<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m200515_142502_add_code_to_languages_table
 */
class m200515_142502_add_code_to_languages_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%languages}}', 'code', Schema::TYPE_STRING . ' NULL');

        $command = Yii::$app->db->createCommand('UPDATE languages SET code=:code WHERE title LIKE :title');

        $command->bindValues([':code' => 'ru', 'title' => '%Русский%'])->queryOne();
        $command->bindValues([':code' => 'en', 'title' => '%Английский%'])->queryOne();
        $command->bindValues([':code' => 'ja', 'title' => '%Японский%'])->queryOne();
        $command->bindValues([':code' => 'zh', 'title' => '%Китайский%'])->queryOne();
        $command->bindValues([':code' => 'hi', 'title' => '%Хинди%'])->queryOne();
        $command->bindValues([':code' => 'es', 'title' => '%Испанский%'])->queryOne();
        $command->bindValues([':code' => 'ar', 'title' => '%Арабский%'])->queryOne();
        $command->bindValues([':code' => 'bn', 'title' => '%Бенгальский%'])->queryOne();
        $command->bindValues([':code' => 'pt', 'title' => '%Португальский%'])->queryOne();
        $command->bindValues([':code' => 'id', 'title' => '%Индонезийский%'])->queryOne();
        $command->bindValues([':code' => 'fr', 'title' => '%Французский%'])->queryOne();
        $command->bindValues([':code' => 'it', 'title' => '%Итальянский%'])->queryOne();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%languages}}', 'code');
    }
}
