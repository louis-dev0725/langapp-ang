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
        $str_search = '';
        $filter = Yii::$app->getRequest()->getBodyParams();
        $meCab = new meCab();
        $str_arTranslate = $meCab->analysis(preg_replace('/\s+/', ' ', $filter['all_text']));

        foreach ($str_arTranslate as $str) {
            $str_offset = (int)mb_strlen($str->getText());
            if ($offset + $str_offset < $filter['offset']) {
                $offset += (int)$str_offset;
            } else {
                $str_search = $str->getText();
                break;
            }
        }

        if ($str_search != '') {
            $res = [];
            $queries = DictionaryWord::find()->where(['&^', 'query', $str_search])->asArray()->limit(100)->all();
            foreach ($queries as $query) {
                $rest = substr($query['query'], 1);
                $rest = substr($rest, 0, -1);

                $res_str = explode(",", $rest);
                foreach ($res_str as $str) {
                    if (strcasecmp($str, $str_search) == 0) {
                        $res[] = $query;
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
