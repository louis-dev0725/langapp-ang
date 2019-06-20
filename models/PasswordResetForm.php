<?php

namespace app\models;

use Yii;
use yii\base\InvalidArgumentException;
use yii\base\Model;

class PasswordResetForm extends Model
{
    public $token;
    public $password;

    /**
     * @var User
     */
    public $user;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['token', 'required'],
            ['token', 'string'],
            ['token', 'validateToken'],
            ['password', 'required'],
            ['password', 'string', 'min' => 6],
        ];
    }

    public function validateToken()
    {
        $this->user = User::findByPasswordResetToken($this->token);
        if ($this->user === null) {
            $this->addError('token', Yii::t('app', 'Wrong link to reset the password.'));
        }
    }

    public function attributeLabels()
    {
        return [
            'password' => Yii::t('app', 'New password'),
        ];
    }

    public function resetPassword()
    {
        $user = $this->user;
        $user->setPassword($this->password);
        $user->resetPasswordToken = '';

        return $user->save(false);
    }
}
