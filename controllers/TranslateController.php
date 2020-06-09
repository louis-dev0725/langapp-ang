<?php

namespace app\controllers;


use app\models\DictionaryWord;
use meCab\meCab;
use Yii;

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
        $count_text = 0;
        $count_sub = 0;
//        $str_search = [];
        $str_search = '';
//        $str_search_original = [];
        $str_search_original = '';
        $filter = Yii::$app->getRequest()->getBodyParams();
        $meCab = new meCab();

        $sub_str = mb_substr($filter['all_text'], 0, $filter['offset']);
        $text = preg_replace('/\s/', '', $filter['all_text'], -1, $count_text);

        preg_replace('/\s/', '', $sub_str, -1, $count_sub);

        $str_arTranslate = $meCab->analysis($text);

        foreach ($str_arTranslate as $str) {
            $str_offset = (int)mb_strlen($str->getText());
//            if ($offset + $str_offset < $filter['offset'] - $count_sub - 10) {
            if ($offset + $str_offset < $filter['offset'] - $count_sub) {
                $offset += (int)$str_offset;
            } else {
//                if ($offset + $str_offset < $filter['offset'] - $count_sub + 5) {
//                    $offset += (int)$str_offset;
//                    $str_search[$offset] = $str->getText();
                    $str_search = $str->getText();
//                    $str_search_original[$offset] = $str->getOriginal();
                    $str_search_original = $str->getOriginal();
//                }
            }
        }

        Yii::info($str_search);
        Yii::info($str_search_original);

//        $pattern = "/[\\\~^°!\"§$%\/()=?`';,\.:_{\[\]}\|<>@+#]/";
//
//        foreach ($str_search as $key => $search) {
//            if (preg_match($pattern, $search)) {
//                unset($str_search[$key]);
//            }
//            if ($search == null || $search == '') {
//                unset($str_search[$key]);
//            }
//        }
//
//        foreach ($str_search_original as $key => $search_original) {
//            if (preg_match($pattern, $search_original)) {
//                unset($str_search_original[$key]);
//            }
//            if ($search_original == null || $search_original == '') {
//                unset($str_search_original[$key]);
//            }
//        }
//
//        Yii::info($str_search);
//        Yii::info($str_search_original);

        if (!empty($str_search)) {
            $res = [];
            $queries = DictionaryWord::find()->where(['&^', 'query', $str_search])->asArray()->limit(100)->all();
            if (!empty($queries)) {
                foreach ($queries as $query) {
                    $rest = substr($query['query'], 1);
                    $rest = substr($rest, 0, -1);

                    $res_str = explode(',', $rest);
                    foreach ($res_str as $str) {
                        if (strcasecmp($str, $str_search) == 0) {
                            $res[] = $query;
                        }
                    }
                }
            } else {
                $queries1 = DictionaryWord::find()->where(['&^', 'query', $str_search_original])->asArray()->limit(100)->all();
                if (!empty($queries1)) {
                    foreach ($queries1 as $query) {
                        $rest = substr($query['query'], 1);
                        $rest = substr($rest, 0, -1);
                        $res_str = explode(',', $rest);
                        foreach ($res_str as $str) {
                            if (strcasecmp($str, $str_search_original) == 0) {
                                $res[] = $query;
                            }
                        }
                    }
                }
            }

            return ['success' => true, 'word' => $str_search, 'res' => $res, 'offset' => $offset];
        }

        return ['success' => false];
    }

    public function actionSelect () {
        $filter = Yii::$app->getRequest()->getBodyParams();

        $res = [];
        $queries = DictionaryWord::find()->where(['&^', 'query', $filter['text']])->asArray()->limit(100)->all();

        if (!empty($queries)) {
            foreach ($queries as $query) {
                $rest = substr($query['query'], 1);
                $rest = substr($rest, 0, -1);

                $res_str = explode(",", $rest);
                foreach ($res_str as $str) {
                    if (strcasecmp($str, $filter['text']) == 0) {
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
