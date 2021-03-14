<?php

namespace app\controllers;


use app\components\Helpers;
use app\models\UserDictionarySearch;
use app\models\DictionaryWord;
use app\models\Mnemonics;
use app\models\UserDictionary;
use Yii;
use yii\data\ActiveDataFilter;
use yii\data\ActiveDataProvider;
use yii\db\ArrayExpression;
use yii\db\Expression;
use yii\rest\IndexAction;
use yii\web\ForbiddenHttpException;

class DictionaryController extends ActiveController
{
    public $modelClass = UserDictionary::class;

    /**
     * @return array
     */
    public function actions()
    {
        $actions = parent::actions();

        $actions['index']['dataFilter'] = [
            'class' => ActiveDataFilter::class,
            'searchModel' => UserDictionarySearch::class,
        ];
        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];

        unset($actions['create']);
        return $actions;
    }

    /**
     * @param IndexAction $action
     * @param mixed $filter
     * @return object|ActiveDataProvider
     * @throws \yii\base\InvalidConfigException
     * @throws ForbiddenHttpException
     */
    public function prepareDataProvider($action, $filter)
    {
        $requestParams = Yii::$app->getRequest()->getBodyParams();
        if (empty($requestParams)) {
            $requestParams = Yii::$app->getRequest()->getQueryParams();
        }

        $query = UserDictionary::find();
        if (!empty($filter)) {
            $query->andWhere($filter);
        }

        $userId = Yii::$app->user->id;
        $query->andWhere(['user_dictionary.user_id' => $userId]);


        if (isset($requestParams['expand']) && is_string($requestParams['expand'])) {
            $expand = preg_split('/\s*,\s*/', $requestParams['expand'], -1, PREG_SPLIT_NO_EMPTY);
        } else {
            $expand = [];
        }
        if (in_array('dictionaryWord', $expand)) {
            $query->with('dictionaryWord');
        }

        return Yii::createObject([
            'class' => ActiveDataProvider::class,
            'query' => $query,
            'pagination' => [
                'params' => $requestParams,
            ],
            'sort' => [
                'params' => $requestParams,
                'defaultOrder' => ['id' => SORT_DESC],
            ],
        ]);
    }

    /**
     * @return array
     * @throws \yii\base\InvalidConfigException
     */
    public function actionCreate()
    {
        $transaction = Yii::$app->db->beginTransaction();
        $params = Yii::$app->getRequest()->getBodyParams();

        /** @var UserDictionary $word */
        $word = UserDictionary::find()->where(['original_word' => $params['wordValue'], 'user_id' => Yii::$app->user->id, 'type' => $params['wordType']])->one();

        if ($word == null) {
            $workout_progress_card = [
                "due" => time()
            ];

            $word = new UserDictionary();
            $word->user_id = Yii::$app->user->id;
            $word->type = $params['wordType'];
            $word->dictionary_word_id = $params['wordId'];
            $word->original_word = $params['wordValue'];
            $word->translate_word = $params['meaningValue'];
            $word->date = Helpers::dateToSql(time());
            $word->context = $params['contextText'];
            $word->url = $params['contextUrl'];
            $word->workout_progress_card = $workout_progress_card;
            $word->success_training = 0;
            $word->number_training = 0;
        } else {
            $word->translate_word = $params['meaningValue'];
            $word->context = $params['contextText'];
            $word->url = $params['contextUrl'];
        }
        $word->save();
        if ($word->hasErrors()) {
            $transaction->rollBack();
            return [
                'success' => false,
                'text' => 'Error while adding word to your dictionary.',
                'errors' => $word->errors,
            ];
        }

        if ($word->type == DictionaryWord::TYPE_JAPANESE_WORD) {
            preg_match_all('/[\x{4E00}-\x{9FFF}]/u', $word->original_word, $tmp);
            $kanjiListValues = $tmp[0];
            if (count($kanjiListValues) > 0) {
                $kanjiListInDb = UserDictionary::find()->where(['original_word' => $kanjiListValues])->andWhere(['user_id' => $word->user_id, 'type' => DictionaryWord::TYPE_JAPANESE_KANJI])->indexBy('original_word')->all();
                /** @var DictionaryWord[] $dictionaryWordList */
                $dictionaryWordList = DictionaryWord::find()->where(['&&', 'query', new ArrayExpression($kanjiListValues)])->andWhere(['type' => DictionaryWord::TYPE_JAPANESE_KANJI])->all();

                foreach ($kanjiListValues as $kanjiValue) {
                    $kanjiInDb = $kanjiListInDb[$kanjiValue] ?? null;
                    if ($kanjiInDb == null) {
                        $dictionaryWord = null;
                        foreach ($dictionaryWordList as $item) {
                            if (in_array($kanjiValue, $item->query->getValue())) {
                                $dictionaryWord = $item;
                                break;
                            }
                        }

                        if ($dictionaryWord != null) {
                            $workout_progress_card = [
                                "due" => time()
                            ];

                            $kanjiInDb = new UserDictionary();
                            $kanjiInDb->user_id = $word->user_id;
                            $kanjiInDb->type = DictionaryWord::TYPE_JAPANESE_KANJI;
                            $kanjiInDb->dictionary_word_id = $dictionaryWord->id;
                            $kanjiInDb->original_word = $kanjiValue;
                            $kanjiInDb->translate_word = $dictionaryWord->getMeaningForLangList(['en']); // TODO: use lang list for user
                            $kanjiInDb->date = date('Y-m-d');
                            $kanjiInDb->context = null;
                            $kanjiInDb->url = null;
                            $kanjiInDb->workout_progress_card = $workout_progress_card;
                            $kanjiInDb->success_training = 0;
                            $kanjiInDb->number_training = 0;
                            //$kanjiInDb->mnemonic = null;
                            $kanjiInDb->save(false);
                            if ($kanjiInDb->hasErrors()) {
                                $transaction->rollBack();
                                return [
                                    'success' => false,
                                    'text' => 'Error while adding kanji from the word to your dictionary.',
                                    'errors' => $kanjiInDb->errors,
                                ];
                            }
                        }
                    }
                }
            }
        }

        $transaction->commit();
        return [
            'success' => true,
            'text' => 'Added to your dictionary.'
        ];
    }

    public function actionQueryOne()
    {
        $filter = Yii::$app->request->queryParams;

        $userId = Yii::$app->user->id;
        $query = UserDictionary::find()->joinWith('dictionaryWord')
            ->where(['user_dictionary.user_id' => $userId, 'user_dictionary.type' => DictionaryWord::TYPE_JAPANESE_WORD])
            ->andWhere(['or like', 'user_dictionary.original_word', explode(',', $filter['word'])])->all();

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
    public function actionAll()
    {
        $filter = Yii::$app->request->queryParams;

        $userId = Yii::$app->user->id;
        $query = UserDictionary::find()->joinWith(['dictionaryWord', 'mnemonic'])
            ->where(['user_dictionary.user_id' => $userId])
            ->andWhere(new Expression("user_dictionary.workout_progress_card->>'due' <= '" . time() . "'"));

        if (array_key_exists('type', $filter) && $filter['type'] != 'undefined' && $filter['type'] != '') {
            if (strcasecmp('kanji', $filter['type']) == 0) {
                $type = DictionaryWord::TYPE_JAPANESE_KANJI;
            } else {
                $type = DictionaryWord::TYPE_JAPANESE_WORD;
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
     * @return ActiveDataProvider
     */
    public function actionComboStudy()
    {
        $requestParams = Yii::$app->getRequest()->getBodyParams();
        if (empty($requestParams)) {
            $requestParams = Yii::$app->getRequest()->getQueryParams();
        }

        $userId = Yii::$app->user->id;
        $query = UserDictionary::find()->joinWith(['dictionaryWord', 'mnemonic'])
            ->where(['user_dictionary.user_id' => $userId])
            ->andWhere(new Expression("user_dictionary.workout_progress_card->>'due' <= '" . time() . "'"));

        if (isset($requestParams['filter']['type'])) {
            $query->andWhere(['user_dictionary.type' => $requestParams['filter']['type']]);
        }

        $query->orderBy(new Expression("user_dictionary.workout_progress_card->>'due' ASC"));
        $query->limit = 10;

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
    public function actionDeleteSelect()
    {
        $filter = Yii::$app->getRequest()->getBodyParams();

        $dictionaries = UserDictionary::find()->where(['id' => $filter])->all();
        foreach ($dictionaries as $dictionary) {
            $dictionary->delete();
        }

        return ['done' => true];
    }
}
