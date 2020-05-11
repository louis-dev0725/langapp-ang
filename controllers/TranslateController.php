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

        Yii::info('$str_arTranslate: ');
        Yii::info($str_arTranslate);
        foreach ($str_arTranslate as $str) {
            Yii::info('$str: ' . $str->getText());
            $str_offset = (int)iconv_strlen($str->getText());
            Yii::info('$str_offset: ' . $str_offset);
            if ($offset + $str_offset <= $filter['offset']) {
                $offset += (int)$str_offset;
                Yii::info('$offset: ' . $offset);
            } else {
                $str_search = $str->getText();
                Yii::info('$str_search: ' . $str_search);
                break;
            }
        }

        Yii::info($str_search);
        if ($str_search != '') {
            $query = DictionaryWord::find()->where(['&^', 'query', $str_search])->asArray()->limit(100)->all();
            return [
                'success' => true,
                'res' => $query
            ];
        }

        return ['success' => false];
    }

}
