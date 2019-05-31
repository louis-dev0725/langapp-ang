<?php

namespace app\controllers;

use app\components\Helpers;
use app\models\ContactForm;
use app\models\LoginForm;
use app\models\PasswordResetForm;
use app\models\RequestPasswordResetForm;
use app\models\Transaction;
use app\models\User;
use app\models\UserSearch;
use Yii;
use yii\data\ActiveDataProvider;
use yii\filters\AccessControl;
use yii\rest\IndexAction;
use yii\web\ForbiddenHttpException;
use yii\web\NotFoundHttpException;
use yii\web\ServerErrorHttpException;

class UserController extends ActiveController
{
    public $modelClass = User::class;

    public function actions()
    {
        $actions = parent::actions();

        unset($actions['create'], $actions['update']);

        $actions['index']['dataFilter'] = [
            'class' => \yii\data\ActiveDataFilter::class,
            'searchModel' => UserSearch::class,
        ];
        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];

        return $actions;
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $availableToEveryone = ['options', 'login', 'create', 'request-reset-password', 'reset-password', 'contact'];

        $behaviors['authenticator']['optional'] = $availableToEveryone;
        $behaviors['access'] = [
            'class' => AccessControl::class,
            'except' => ['options'],
            'rules' => [
                [
                    'allow' => true,
                    'actions' => $availableToEveryone,
                    //'roles' => ['?'],
                ],
                [
                    'allow' => true,
                    'actions' => ['me', 'update', 'invited-users'],
                    'roles' => ['@'],
                ],
                [
                    'allow' => true,
                    'actions' => ['index', 'delete', 'check-invited-users'],
                    'roles' => ['admin'],
                ],
            ]
        ];

        return $behaviors;
    }

    protected function verbs()
    {
        $verbs = parent::verbs();

        $verbs['login'] = ['POST'];
        $verbs['request-reset-password'] = ['POST'];
        $verbs['reset-password'] = ['POST'];
        $verbs['check-invited-users'] = ['POST'];
        $verbs['invited-users'] = ['GET'];
        $verbs['contact'] = ['POST'];

        return $verbs;
    }

    /**
     * @param IndexAction $action
     * @param mixed $filter
     * @return object|ActiveDataProvider
     * @throws \yii\base\InvalidConfigException
     * @throws ForbiddenHttpException
     */
    public function prepareDataProvider($action, $filter)
    {
        $requestParams = Yii::$app->getRequest()->getBodyParams();
        if (empty($requestParams)) {
            $requestParams = Yii::$app->getRequest()->getQueryParams();
        }

        $query = User::find();
        if (!empty($filter)) {
            $likeFields = ['name', 'company', 'email'];
            foreach ($filter as $field => $value) {
                if (in_array($field, $likeFields)) {
                    unset($filter[$field]);
                    $query->andWhere(['like', $field, $value]);

                }
            }
            $query->andWhere($filter);
        }

        return Yii::createObject([
            'class' => ActiveDataProvider::class,
            'query' => $query,
            'pagination' => [
                'params' => $requestParams,
            ],
            'sort' => [
                'params' => $requestParams,
                'defaultOrder' => ['id' => SORT_ASC],
            ],
        ]);
    }

    public function actionContact()
    {
        $model = new ContactForm();

        $model->subject = 'Обратная связь';
        if (!Yii::$app->user->isGuest) {
            $user = User::findOne(Yii::$app->user->id);
        } else {
            $user = null;
        }
        if ($user != null) {
            $model->email = $user->email;
            $model->name = $user->name;
            $model->subject .= ' #' . $user->id;
        }

        $model->load(Yii::$app->getRequest()->getBodyParams(), '');

        if ($model->validate()) {
            if ($model->name != '') {
                $model->subject .= ' (' . $model->name . ')';
            }
            if ($model->name == '' && $user == null) {
                $model->subject .= ' ' . Yii::$app->formatter->asDatetime(time());
            }
            if ($model->contact(Yii::$app->params['adminEmail'])) {
                return ['done' => true];
            }
            else {
                $model->addError('email', 'Не удалось отправить сообщение. Пожалуйста, свяжитесь с нами по E-mail: ' . Yii::$app->params['adminEmail']);
            }
        }

        return $model;
    }

    public function actionInvitedUsers($id)
    {
        // note: [SHR]: this changes need to push to repository
        $id = (int) $id;
        $userId = Yii::$app->user->id;
        if (Helpers::isAdmin()) {
            $model = User::findOne($id);
            if ($model == null) {
                throw new NotFoundHttpException("Object not found: $id");
            }
            $userId = $model->id;
        } elseif ($id !== $userId) {
            throw new ForbiddenHttpException('You can view/edit only your own profile.');
        }

        $users = User::find()->where(['invitedByUserId' => $userId])->all();
        foreach ($users as $user) {
            $user->scenario = User::SCENARIO_INVITED_USER;
        }

        return $users;
    }

    public function actionCreate()
    {
        $model = new User([
            'scenario' => User::SCENARIO_REGISTER,
        ]);

        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->save()) {
            $model->scenario = User::SCENARIO_PROFILE;
            $model->refresh();
            $result = $this->serializeData($model);
            $result['accessToken'] = $model->generateAccessToken();

            return $result;
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
        }

        return $model;
    }

    public function actionLogin()
    {
        $model = new LoginForm();
        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->validate()) {
            $token = $model->user->generateAccessToken();
            return ['accessToken' => $token];
        }

        return $model;
    }

    public function actionRequestResetPassword()
    {
        $model = new RequestPasswordResetForm();
        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->validate()) {
            $sent = $model->sendEmail();
            return ['done' => true, 'successfullySent' => $sent];
        }

        return $model;
    }

    public function actionResetPassword()
    {
        $model = new PasswordResetForm();
        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->validate()) {
            $model->resetPassword();
            $token = $model->user->generateAccessToken();
            return ['done' => true, 'accessToken' => $token];
        }

        return $model;
    }

    public function actionMe()
    {
        $userId = Yii::$app->user->id;
        $model = User::findOne($userId);
        if ($model == null) {
            throw new NotFoundHttpException('User not found');
        }

        $model->scenario = User::SCENARIO_PROFILE;

        return $model;
    }

    public function actionUpdate($id)
    {
        $model = User::findOne($id);
        if ($model == null) {
            throw new NotFoundHttpException("Object not found: $id");
        }

        $this->checkAccess('update', $model);

        $model->scenario = 'profile';
        if (Helpers::isAdmin()) {
            $model->scenario = 'admin';
        }
        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->save()) {
            $result = $this->serializeData($model);
            $result['accessToken'] = $model->generateAccessToken();

            return $result;
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
        }

        return $model;
    }

    public function actionCheckInvitedUsers($id)
    {
        $model = User::findOne($id);
        if ($model == null) {
            throw new NotFoundHttpException("Object not found: $id");
        }

        $model->checkInvitedUsers();

        return ['done' => true];
    }

    /**
     * @param string $action the ID of the action to be executed
     * @param User $model the model to be accessed. If null, it means no specific model is being accessed.
     * @param array $params additional parameters
     * @throws ForbiddenHttpException if the user does not have access
     */
    public function checkAccess($action, $model = null, $params = [])
    {
        if (Helpers::isAdmin()) {
            if ($model != null) {
                $model->scenario = User::SCENARIO_ADMIN;
            }
        } else {
            if ($action == 'create') {
                // Can create user
            } elseif ($action == 'update' || $action == 'view') {
                if ($model->id !== Yii::$app->user->id) {
                    throw new ForbiddenHttpException('You can view/edit only your own profile.');
                }
            } else {
                throw new ForbiddenHttpException();
            }
        }
    }
}
