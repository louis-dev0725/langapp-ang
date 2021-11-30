<?php

namespace app\controllers;

use app\models\Languages;
use Yii;
use yii\web\Controller;
use yii\web\Cookie;

class SiteController extends Controller
{
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
        ];
    }

    public function actionIndex($lang = '')
    {
        $availableLanguageCodes = ['ru', 'en'];
        $languages = Languages::find()->where(['code' => $availableLanguageCodes])->indexBy('code')->all();

        $languageFromCookies = Yii::$app->request->cookies->getValue('language');
        if (isset($languages[$lang])) {
            Yii::$app->language = $lang;
            // TODO: save to cookies to use in Angular frontend
            Yii::$app->response->cookies->add(new Cookie([
                'name' => 'language',
                'value' => Yii::$app->language,
                'expire' => time() + 60 * 60 * 24 * 365 * 10,
                'httpOnly' => false,
            ]));
        } elseif ($languageFromCookies != null && isset($languages[$languageFromCookies])) {
            Yii::$app->language = $languageFromCookies;
        } else {
            Yii::$app->language = Yii::$app->request->getPreferredLanguage($availableLanguageCodes);
        }

        $this->layout = false;

        return $this->render('index', [
            'languages' => $languages,
        ]);
    }

    public function actionRobotsTxt() {
        $response = Yii::$app->response;
        $response->format = yii\web\Response::FORMAT_RAW;
        $response->headers->set('Content-Type', 'text/plain;charset=UTF-8');

        if (isset($_SERVER['IS_PROD']) && $_SERVER['IS_PROD'] == '1') {
            return 'User-agent: *
Disallow: ';
        } else {
            return 'User-agent: *
Disallow: /';
        }
    }

    public function actionError()
    {
        return $this->render('error');
    }
}
