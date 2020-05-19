<?php

namespace app\controllers;


use app\models\DictionaryWord;
use app\models\UserDictionary;
use Yii;

class DictionaryController extends ActiveController {
    public $modelClass = UserDictionary::class;

    /**
     * @return array
     */
    public function actions() {
        $actions = parent::actions();
        unset($actions['create']);
        return $actions;
    }

    public function actionCreate () {
        $objWord = Yii::$app->getRequest()->getBodyParams();

        $word = UserDictionary::find()->where(['like', 'original_word', $objWord['word']])
            ->andWhere(['user_id' => $objWord['user_id']])->andWhere(['type' => UserDictionary::TYPE_WORD])->asArray()
            ->one();

        if (empty($word)) {
            $context = preg_replace('/\s+/', ' ', $objWord['context']);

            $new_word = new UserDictionary();
            $new_word->user_id = $objWord['user_id'];
            $new_word->type = UserDictionary::TYPE_WORD;
            $new_word->dictionary_word_id = $objWord['dictionary_id'];
            $new_word->original_word = $objWord['word'];
            $new_word->translate_word = $objWord['translate'];
            $new_word->date = date('Y-m-d');
            $new_word->context = $context;
            $new_word->url = $objWord['url'];
            $new_word->success_training = 0;
            $new_word->number_training = 0;
            $new_word->workout_progress_card = 0;
            $new_word->workout_progress_word_translate = 0;
            $new_word->save();

            preg_match_all('/[\x{4E00}-\x{9FFF}]/u', $objWord['word'], $kanjis);
            foreach ($kanjis as $kanji) {
                $all_k = UserDictionary::find()->where(['like', 'original_word', $kanji])
                    ->andWhere(['user_id' => $objWord['user_id']])->andWhere(['type' => UserDictionary::TYPE_KANJI])
                    ->asArray()->one();

                if (empty($all_k)) {
                    $d_id = DictionaryWord::find()->where(['&@', 'query', $kanji])->andWhere(['dictionary' => 2])
                        ->asArray()->one();

                    if (!empty($d_id)) {
                        $new_k = new UserDictionary();
                        $new_k->user_id = $objWord['user_id'];
                        $new_k->type = UserDictionary::TYPE_KANJI;
                        $new_k->dictionary_word_id = $d_id['id'];
                        $new_k->original_word = $kanji;
                        $new_k->translate_word = null;
                        $new_k->date = date('Y-m-d');
                        $new_k->context = null;
                        $new_k->url = null;
                        $new_k->success_training = 0;
                        $new_k->number_training = 0;
                        $new_k->workout_progress_card = 0;
                        $new_k->workout_progress_word_translate = 0;
                        $new_k->save(false);
                    }
                }
            }

            return [
                'success' => true,
                'text' => 'Слово добавлено в словарь.'
            ];
        } else {
            return [
                'success' => true,
                'text' => 'Данное слово уже есть в словаре.'
            ];
        }
    }
}
