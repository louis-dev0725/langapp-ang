<?php

namespace app\controllers;


use app\models\DictionaryWord;
use meCab\meCab;
use Yii;
use yii\db\ArrayExpression;

class TranslateController extends ActiveController {
    public $modelClass = DictionaryWord::class;

    /**
     * @return array
     */
    public function actions() {
        $actions = parent::actions();
        unset($actions['create']);
        return $actions;
    }

    public function actionCreate () {
        $offset = 0;
        $word_offset = [];
        $str_search = [];
        $filter = Yii::$app->getRequest()->getBodyParams();
        $meCab = new meCab();

        $sub_str = mb_substr($filter['all_text'], 0, $filter['offset']);
        $text = preg_replace('/\s/', '', $filter['all_text'], -1, $count_text);

        preg_replace('/\s/', '', $sub_str, -1, $count_sub);

        $str_arTranslate = $meCab->analysis($text);

        $requestedOffset = $filter['offset'] - $count_sub;

        foreach ($str_arTranslate as $str) {
            $str_offset = (int)mb_strlen($str->getText());
            if ($offset + $str_offset < $requestedOffset - 10) {
                $offset += (int)$str_offset;
            } else {
                $str_search[$offset] = $str->getText();
                $str_search[$offset . '_1'] = $str->getOriginal();
                $offset += (int)$str_offset;
                if ($offset > $requestedOffset) {
                    break;
                }
            }
        }

        $pattern = "/[\\\~^°!\"§$%\/()=?`';,\.:_{\[\]}\|<>@+#]/";

        foreach ($str_search as $key => $search) {
            if (preg_match($pattern, $search)) {
                unset($str_search[$key]);
            }
            if ($search == null || $search == '') {
                unset($str_search[$key]);
            }
        }

        $search_arr = array_unique($str_search);

        if (!empty($search_arr)) {
            $res = [];
            $queries = DictionaryWord::find()->where(['&^|', 'query', new ArrayExpression($search_arr)])->distinct()
                ->orderBy(['id' => SORT_ASC])->all();
            if (!empty($queries)) {
                foreach ($search_arr as $key => $currentWord) {
                    $currentSearchResults = array_filter($queries, function($value) use ($currentWord) {
                        foreach ($value->query as $query) {
                            if (substr($query, 0, strlen($currentWord)) == $currentWord) {
                                return true;
                            }
                        }
                        return false;
                    });

                    $current_arr = explode('_', $key);

                    $minWordLength = $requestedOffset - (int)$current_arr[0] + 1;
                    foreach ($currentSearchResults as $wordFromDict) {
                        foreach ($wordFromDict->query as $query) {
                            if (mb_strlen($query) >= $minWordLength &&
                                strcasecmp(mb_substr($text, (int)$current_arr[0], mb_strlen($query)), $query) == 0) {
                                if (empty($res)) {
                                    $word_offset['word'] = $query;
                                    $word_offset['s_offset'] = (int)$current_arr[0] + $count_sub;
                                    $word_offset['e_offset'] = (int)$current_arr[0] + mb_strlen($query) + $count_sub;
                                }
                                $res[] = $wordFromDict;
                                break;
                            }
                        }
                    }
                }
            }

            return ['success' => true, 'word' => $word_offset, 'res' => $res];
        }

        return ['success' => false];
    }

    public function actionSelect () {
        $filter = Yii::$app->getRequest()->getBodyParams();

        $res = [];
        $queries = DictionaryWord::find()->where(['&^', 'query', $filter['text']])->limit(100)->all();

        if (!empty($queries)) {
            foreach ($queries as $query) {
                foreach ($query->query as $q) {
                    if (strcasecmp($q, $filter['text']) == 0) {
                        $res[] = $query;
                    }
                }
            }

            return ['success' => true, 'word' =>  $filter['text'], 'res' => $res];
        } else {
            return ['success' => false];
        }
    }
}
