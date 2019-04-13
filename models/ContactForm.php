<?php

namespace app\models;

use Yii;
use yii\base\Model;

/**
 * ContactForm is the model behind the contact form.
 */
class ContactForm extends Model
{
    public $name;
    public $email;
    public $subject;
    public $body;

    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
            [['email', 'body'], 'required'],
            ['name', 'safe'],
            ['email', 'email'],
        ];
    }

    /**
     * @return array customized attribute labels
     */
    public function attributeLabels()
    {
        return [
            'name' => Yii::t('app', 'Имя'),
            'email' => Yii::t('app', 'E-mail'),
            'subject' => Yii::t('app', 'Тема'),
            'body' => Yii::t('app', 'Текст'),
        ];
    }

    /**
     * Sends an email to the specified email address using the information collected by this model.
     * @param string $email the target email address
     * @return bool whether the model passes validation
     */
    public function contact($email)
    {
        return Yii::$app->mailer->compose('contact', ['model' => $this])
            ->setTo($email)
            ->setFrom([$this->email => $this->name])
            ->setSubject($this->subject)
            ->setTextBody($this->body)
            ->send();
    }
}
