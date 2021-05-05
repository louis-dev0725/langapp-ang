<?php

namespace app\models;

use Yii;
use yii\base\Model;

class RequestPasswordResetForm extends Model
{
    public $email;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['email', 'filter', 'filter' => 'strtolower'],
            ['email', 'filter', 'filter' => 'trim'],
            ['email', 'required'],
            ['email', 'email'],
            ['email', 'exist', 'targetClass' => User::class, 'message' => Yii::t('app', 'User with such email was not found.')],
        ];
    }

    public function attributeLabels()
    {
        return [
            'email' => 'E-mail',
        ];
    }

    /**
     * Sends an email with a link, for resetting the password.
     *
     * @return bool whether the email was send
     */
    public function sendEmail()
    {
        $user = User::findByEmail($this->email);
        if (!$user) {
            return false;
        }

        return Yii::$app
            ->mailer
            ->compose(
                'resetPassword',
                ['user' => $user]
            )
            ->setCharset('utf-8')
            ->setFrom([Yii::$app->params['noreplyEmail'] => Yii::$app->params['fromName']])
            ->setTo($this->email)
            ->setSubject(Yii::$app->params['siteName'] . ': восстановление пароля')
            ->send();
    }
}
