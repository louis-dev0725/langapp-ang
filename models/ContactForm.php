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
    public $telephone;
    public $body;

    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
            [['email', 'body'], 'required'],
            [['name', 'telephone'], 'safe'],
            ['email', 'email'],
        ];
    }

    /**
     * @return array customized attribute labels
     */
    public function attributeLabels()
    {
        return [
            'name' => Yii::t('app', 'Name'),
            'email' => Yii::t('app', 'E-mail'),
            'telephone' => Yii::t('app', 'Telephone'),
            'subject' => Yii::t('app', 'Topic'),
            'body' => Yii::t('app', 'Body'),
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
