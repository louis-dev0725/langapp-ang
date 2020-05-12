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
        $str_arTranslate = $meCab->analysis(preg_replace('/\s+/', '', $filter['all_text']));

        foreach ($str_arTranslate as $str) {
            $str_offset = (int)iconv_strlen($str->getText());
            if ($offset + $str_offset <= $filter['offset']) {
                $offset += (int)$str_offset;
            } else {
                $str_search = $str->getText();
                break;
            }
        }

        if ($str_search != '') {
            $query = DictionaryWord::find()->where(['&^', 'query', $str_search])->asArray()->limit(100)->all();
            return [
                'success' => true,
                'word' => $str_search,
                'res' => $query
            ];
        }

        return ['success' => false];
    }

}
