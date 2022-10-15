<?php

namespace app\controllers;

use app\behaviors\PaidOnlyBehavior;
use app\exceptions\FileException;
use app\models\Mnemonics;
use app\models\MnemonicsUsers;
use app\models\traits\UploadFilesTrait;
use Yii;
use yii\base\InvalidConfigException;
use yii\db\ActiveRecord;
use yii\web\ServerErrorHttpException;
use yii\web\UploadedFile;

class MnemonicController extends ActiveController
{
    use UploadFilesTrait;

    public $modelClass = Mnemonics::class;

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['access']['rules'] = [
            [
                'allow' => true,
                'actions' => ['index', 'view', 'create'],
                'roles' => ['@'],
            ],
            [
                'allow' => true,
                'actions' => ['update', 'delete'],
                'roles' => ['admin'],
            ],
        ];

        $behaviors['paid'] = PaidOnlyBehavior::class;

        return $behaviors;
    }

    /**
     * @return array
     */
    public function actions(): array
    {
        $actions = parent::actions();
        unset($actions['index'], $actions['create'], $actions['update']);

        return $actions;
    }

    public function actionIndex(): array
    {
        $filter = Yii::$app->request->queryParams;

        $query = Mnemonics::find()->joinWith('mnemonicsUsers')
            ->where(['mnemonics.word' => explode(',', $filter['mnemonic'])])
            ->orderBy(['mnemonics.rating' => SORT_DESC])->all();

        return [
            'mnemonics' => $query,
        ];
    }

    /**
     * @return array
     * @throws FileException
     */
    public function actionCreate(): array
    {
        $mnemonic = new Mnemonics();

        $mnemonic_data = Yii::$app->request->post();

        $mnemonic->user_id = $mnemonic_data['user_id'];
        $mnemonic->word = $mnemonic_data['word'];
        $mnemonic->text = $mnemonic_data['text'];
        $mnemonic->image = UploadedFile::getInstanceByName('image');
        if ($mnemonic->image && $mnemonic->validate()) {
            $mnemonic->images = $this->uploadImage($mnemonic, 'image', 'mnemonic');
        }
        $mnemonic->save(false);

        return [
            'success' => true,
            'text' => $mnemonic->text,
            'image' => $mnemonic->images,
            'id' => $mnemonic->id,
        ];
    }

    /**
     * @param $id
     *
     * @return array|ActiveRecord|null
     * @throws InvalidConfigException
     * @throws ServerErrorHttpException
     */
    public function actionUpdate($id)
    {
        // TODO: allow edit only for user who created it or admin
        return;
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
