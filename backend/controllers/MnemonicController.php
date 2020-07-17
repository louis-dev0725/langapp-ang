<?php

namespace app\controllers;


use app\models\Mnemonics;
use app\models\MnemonicsUsers;
use app\models\traits\UploadFilesTrait;
use app\models\User;
use Yii;
use yii\web\ServerErrorHttpException;
use yii\web\UploadedFile;

class MnemonicController extends ActiveController {
    use UploadFilesTrait;

    public $modelClass = Mnemonics::class;

    /**
     * @return array
     */
    public function actions() {
        $actions = parent::actions();
        unset($actions['index'], $actions['create'], $actions['update']);
        return $actions;
    }

    public function actionIndex() {
        $filter = Yii::$app->request->queryParams;

        $query = Mnemonics::find()->joinWith('mnemonicsUsers')
            ->where(['mnemonics.word' => explode(',', $filter['mnemonic'])])
            ->orderBy(['mnemonics.rating' => SORT_DESC])->all();

        return [
            'mnemonics' => $query
        ];
    }

    /**
     * @return array
     */
    public function actionCreate() {
        $mnemonic = new Mnemonics();

        $mnemonic_data = Yii::$app->request->post();

        $mnemonic->user_id = $mnemonic_data['user_id'];
        $mnemonic->word = $mnemonic_data['word'];
        $mnemonic->text = $mnemonic_data['text'];
        $mnemonic->image = UploadedFile::getInstanceByName('image');
        if ($mnemonic->image) {
            $mnemonic->images = $this->uploadImage($mnemonic, 'image', 'mnemonic');
        }
        $mnemonic->save(false);

        return [
            'success' => true,
            'text' => $mnemonic->text,
            'image' => $mnemonic->images,
            'id' => $mnemonic->id
        ];
    }

    /**
     * @param $id
     *
     * @return array|\yii\db\ActiveRecord|null
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate($id) {
        $model = Mnemonics::find()->where(['id' => $id])->one();

        $user = Yii::$app->getRequest()->getBodyParams()['user_rating'];

        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->save() === false && !$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
        }

        if ($model->save()) {
            $mnemonicUser = new MnemonicsUsers();
            $mnemonicUser->mnemonics_id = $id;
            $mnemonicUser->users_id = $user['user_id'];
            $mnemonicUser->rating = $user['rating'];
            $mnemonicUser->save(false);
        }

        return $model;
    }
}
