<?php

namespace app\controllers;

use app\behaviors\PaidOnlyBehavior;
use app\models\DictionaryWord;
use meCab\meCab;
use Yii;
use yii\db\ArrayExpression;

class TranslateController extends ActiveController
{
    public $modelClass = DictionaryWord::class;

    /**
     * @return array
     */
    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);

        return $actions;
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['access']['rules'] = [
            [
                'allow' => true,
                'actions' => ['create', 'select'],
                'roles' => ['@'],
            ],
        ];

        $behaviors['paid'] = PaidOnlyBehavior::class;

        return $behaviors;
    }

    public function actionCreate()
    {
        $a = 0;
        $word_offset_arr = [];
        $res = [];
        $originalText = Yii::$app->request->getBodyParam('all_text');
        $clickedOffset = Yii::$app->request->getBodyParam('offset');

        $meCab = new meCab();

        preg_replace('/\s/u', '', mb_substr($originalText, 0, $clickedOffset), -1, $countSpaces);
        $cleanedText = preg_replace('/\s/u', '', $originalText);

        $mecabWords = $meCab->analysis($cleanedText);

        $requestedOffset = $clickedOffset - $countSpaces;

        $toSearch = [];
        $currentOffset = 0;
        foreach ($mecabWords as $mecabWord) {
            $wordText = $mecabWord->getText();
            // User clicked on this word
            if ($currentOffset + mb_strlen($wordText) > $requestedOffset) {
                $wordOriginal = $mecabWord->getOriginal();
                $toSearch[$currentOffset] = '';
                $toSearchCopy = $toSearch;
                foreach ($toSearchCopy as $key => $item) {
                    $toSearch[$key . '_1'] = $toSearch[$key] . $wordOriginal;
                    $toSearch[$key] .= $wordText;
                }
                unset($toSearchCopy);
                break;
            } // Word within 10 chars before user click
            elseif ($currentOffset >= $requestedOffset - 10) {
                $toSearch[$currentOffset] = '';
                foreach ($toSearch as $key => $item) {
                    $toSearch[$key] .= $wordText;
                }
            }
            $currentOffset += mb_strlen($wordText);
        }

        $toSearchBeforeFilter = $toSearch;
        $toSearch = array_filter($toSearch, function ($search) {
            if (empty($search)) {
                return false;
            } elseif (preg_match('/[\\\~^°!\"§$%\/()=?`\';,.:_{\[\]}|<>@+#。]/u', $search)) {
                return false;
            } elseif (mb_strlen($search) == 1 && preg_match('/^[ぁ-んァ-ン]$/u', $search)) {
                return false;
            }

            return true;
        });

        $toSearch = array_unique($toSearch);

        Yii::debug('Search for:');
        Yii::debug($toSearch);

        if (!empty($toSearch)) {
            Yii::beginProfile('query');
            $queries = DictionaryWord::find()->where(['&^|', 'query', new ArrayExpression($toSearch)])->distinct()
                ->orderBy(['id' => SORT_ASC])->all();
            Yii::endProfile('query');
            Yii::debug('Found ' . count($queries) . ' words');
            if (!empty($queries)) {
                foreach ($toSearch as $key => $currentWord) {
                    Yii::beginProfile('Filter for word ' . $currentWord);
                    $currentSearchResults = array_filter($queries, function ($value) use ($currentWord) {
                        foreach ($value->query as $query) {
                            if (substr($query, 0, strlen($currentWord)) == $currentWord) {
                                return true;
                            }
                        }

                        return false;
                    });
                    Yii::endProfile('Filter for word ' . $currentWord);

                    Yii::beginProfile('Process word ' . $currentWord);
                    $current_arr = explode('_', $key);

                    $minWordLength = $requestedOffset - (int) $current_arr[0] + 1;
                    foreach ($currentSearchResults as $wordFromDict) {
                        foreach ($wordFromDict->query as $query) {
                            if (mb_strlen($query) >= $minWordLength &&
                                (in_array($query, $toSearch, true) || strcasecmp(mb_substr($cleanedText, (int) $current_arr[0], mb_strlen($query)), $query) == 0)) {
                                $word_offset_arr[$a]['word'] = $query;
                                $word_offset_arr[$a]['kana'] = $wordFromDict->sourceData['kana'][0]['text'];
                                $word_offset_arr[$a]['s_offset'] = (int) $current_arr[0] + $countSpaces;
                                $word_offset_arr[$a]['e_offset'] = (int) $current_arr[0] + mb_strlen($query) + $countSpaces;
                                $res[] = $wordFromDict;
                                $a++;
                                break;
                            }
                        }
                    }
                    Yii::endProfile('Process word ' . $currentWord);
                }
            }

            Yii::beginProfile('usort');
            usort($word_offset_arr, function ($a, $b) {
                $aa = mb_strlen($a['word']);
                $bb = mb_strlen($b['word']);

                if ($aa == $bb) {
                    return 0;
                }

                return ($aa < $bb) ? 1 : -1;
            });
            Yii::endProfile('usort');
            $word_offset = $word_offset_arr[0];

            Yii::debug('Finished');

            return ['success' => true, 'word' => $word_offset, 'res' => $res, 'words' => $word_offset_arr];
        }

        return ['success' => false];
    }

    public function actionSelect()
    {
        $filter = Yii::$app->getRequest()->getBodyParams();

        $res = [];
        $queries = DictionaryWord::find()->where(['&^', 'query', $filter['text']])->limit(100)->all();

        //if (!empty($queries)) {
        foreach ($queries as $query) {
            foreach ($query->query as $q) {
                if (strcasecmp($q, $filter['text']) == 0) {
                    $res[] = $query;
                }
            }
        }

        return ['success' => true, 'word' => $filter['text'], 'res' => $res];
        //} else {
        //    return ['success' => false];
        //}
    }
}

class ResultWord
{
    public $offset;
    public $word;
}
