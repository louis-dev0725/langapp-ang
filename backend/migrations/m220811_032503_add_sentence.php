<?php

use yii\db\Migration;

/**
 * Class m220811_032503_add_sentence
 */
class m220811_032503_add_sentence extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->execute('CREATE TABLE "public"."sentence" (
            id serial NOT NULL PRIMARY KEY,
            "hash" text NOT NULL DEFAULT \'\',
            "wordId" int4 NOT NULL DEFAULT 0,
            "source" text NOT NULL DEFAULT \'\',
            "score" float4 NOT NULL DEFAULT 0.0,
            "text" text NOT NULL DEFAULT \'\',
            "translations" jsonb NOT NULL DEFAULT \'{}\',
            "needTranslation" boolean NOT NULL DEFAULT false
        )');
        $this->execute('CREATE INDEX "sentence_wordId_idx" ON "public"."sentence" ("wordId")');
        // $this->execute('CREATE INDEX "sentence_text_idx" ON "public"."sentence" ("hash")');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->execute('DROP TABLE "public"."sentence"');
        // $this->execute('DROP INDEX "sentence_text_idx"');
    }
}
