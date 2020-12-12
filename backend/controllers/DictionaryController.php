<?php

namespace app\controllers;


use app\models\DictionaryWord;
use app\models\Mnemonics;
use app\models\UserDictionary;
use Yii;
use yii\data\ActiveDataProvider;
use yii\db\Expression;

class DictionaryController extends ActiveController {
    public $modelClass = UserDictionary::class;

    /**
     * @return array
     */
    public function actions() {
        $actions = parent::actions();
        unset($actions['index'], $actions['create']);
        return $actions;
    }

    /**
     * @return ActiveDataProvider
     */
    public function actionIndex() {
        $filter = Yii::$app->request->queryParams;

        $query = UserDictionary::find()->joinWith('dictionaryWord')
            ->where(['user_dictionary.user_id' => (int)$filter['user_id']]);

        if (array_key_exists('type', $filter) && $filter['type'] != 'undefined' && $filter['type'] != '') {
            if (strcasecmp('kanji', $filter['type']) == 0) {
                $type = UserDictionary::TYPE_KANJI;
            } else {
                $type = UserDictionary::TYPE_WORD;
            }

            $query->andWhere(['user_dictionary.type' => (int)$type]);
        }

        return new ActiveDataProvider([
            'query' => $query,
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_DESC
                ],
            ]
        ]);
    }

    /**
     * @return array
     * @throws \yii\base\InvalidConfigException
     */
    public function actionCreate () {
        $objWord = Yii::$app->getRequest()->getBodyParams();

        $word = UserDictionary::find()->where(['like', 'original_word', $objWord['word']])
            ->andWhere(['user_id' => $objWord['user_id'], 'type' => UserDictionary::TYPE_WORD])->asArray()->one();

        if (empty($word)) {
            $context = preg_replace('/\s/', '', $objWord['context']);

            $workout_progress_card = [
                "due" => time()
            ];

            $new_word = new UserDictionary();
            $new_word->user_id = $objWord['user_id'];
            $new_word->type = UserDictionary::TYPE_WORD;
            $new_word->dictionary_word_id = $objWord['dictionary_id'];
            $new_word->original_word = $objWord['word'];
            $new_word->translate_word = $objWord['translate'];
            $new_word->date = date('Y-m-d');
            $new_word->context = $context;
            $new_word->url = $objWord['url'];
            $new_word->workout_progress_card = $workout_progress_card;
            $new_word->success_training = 0;
            $new_word->number_training = 0;
            //$new_word->mnemonic = null;
            $new_word->save();

            preg_match_all('/[\x{4E00}-\x{9FFF}]/u', $objWord['word'], $kanjis);
            foreach ($kanjis[0] as $kanji) {
                $all_k = UserDictionary::find()->where(['original_word' => $kanji])
                    ->andWhere(['user_id' => $objWord['user_id'], 'type' => UserDictionary::TYPE_KANJI])->asArray()
                    ->one();

                if (empty($all_k)) {
                    $d_id = DictionaryWord::find()->where(['&@', 'query', $kanji])->andWhere(['dictionary' => 2])
                        ->asArray()->one();

                    if (!empty($d_id)) {
                        $workout_progress_card = [
                            "due" => time()
                        ];

                        $new_k = new UserDictionary();
                        $new_k->user_id = $objWord['user_id'];
                        $new_k->type = UserDictionary::TYPE_KANJI;
                        $new_k->dictionary_word_id = $d_id['id'];
                        $new_k->original_word = $kanji;
                        $new_k->translate_word = null;
                        $new_k->date = date('Y-m-d');
                        $new_k->context = null;
                        $new_k->url = null;
                        $new_k->workout_progress_card = $workout_progress_card;
                        $new_k->success_training = 0;
                        $new_k->number_training = 0;
                        //$new_k->mnemonic = null;
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

    public function actionQueryOne() {
        $filter = Yii::$app->request->queryParams;

        $query = UserDictionary::find()->joinWith('dictionaryWord')
            ->where(['user_dictionary.user_id' => (int)$filter['user_id'], 'user_dictionary.type' => UserDictionary::TYPE_WORD])
            ->andWhere(['or like', 'user_dictionary.original_word' , explode(',', $filter['word'])])->all();

        $query1 = Mnemonics::find()->joinWith('mnemonicsUsers')
            ->where(['mnemonics.word' => explode(',', $filter['mnemonic'])])
            ->orderBy(['mnemonics.rating' => SORT_DESC])->all();

        return [
            'words' => $query,
            'mnemonics' => $query1
        ];
    }

    /**
     * @return ActiveDataProvider
     */
    public function actionAll() {
        $filter = Yii::$app->request->queryParams;

        $query = UserDictionary::find()->joinWith(['dictionaryWord', 'mnemonic'])
            ->where(['user_dictionary.user_id' => (int)$filter['user_id']])
            ->andWhere(new Expression("user_dictionary.workout_progress_card->>'due' <= '" . time() . "'"));

        if (array_key_exists('type', $filter) && $filter['type'] != 'undefined' && $filter['type'] != '') {
            if (strcasecmp('kanji', $filter['type']) == 0) {
                $type = UserDictionary::TYPE_KANJI;
            } else {
                $type = UserDictionary::TYPE_WORD;
            }

            $query->andWhere(['user_dictionary.type' => (int)$type]);
        }

        $query->orderBy(new Expression("user_dictionary.workout_progress_card->>'due' ASC"));

        return new ActiveDataProvider([
            'query' => $query,
            'pagination' => false
        ]);
    }

    /**
     * @return bool[]
     * @throws \Throwable
     * @throws \yii\base\InvalidConfigException
     * @throws \yii\db\StaleObjectException
     */
    public function actionDeleteSelect() {
        $filter = Yii::$app->getRequest()->getBodyParams();

        $dictionaries = UserDictionary::find()->where(['id' => $filter])->all();
        foreach ($dictionaries as $dictionary) {
            $dictionary->delete();
        }

        return ['done' => true];
    }
}
