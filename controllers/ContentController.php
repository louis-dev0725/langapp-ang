<?php

namespace app\controllers;


use app\models\Category;
use app\models\Content;
use app\models\ContentCategory;
use Yii;

class ContentController extends ActiveController {
    public $modelClass = Content::class;

    public function actions() {
        $actions = parent::actions();
        unset($actions['create']);
        return $actions;
    }

    public function actionCreate() {
        $content = new Content();
        $content->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($content->validate()) {
            $content->save();

            Yii::info($content);
            if (!empty($content->category)) {
                $categories = Category::find()->where(['id' => $content->category])->all();

                foreach ($categories as $category) {
                    $content->link('categories', $category);
                }
            }

            return ['done' => true];
        } else {
            return ['done' => false];
        }
    }

}
