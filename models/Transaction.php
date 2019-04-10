<?php

namespace app\models;

use app\components\Helpers;
use Yii;
use yii\behaviors\AttributeBehavior;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "transactions".
 *
 * @property int $id
 * @property int $userId
 * @property string $money
 * @property int $isCommon
 * @property string $comment
 * @property string $addedDateTime
 * @property int $isPartner
 * @property int $isRealMoney
 * @property int $fromInvitedUserId
 * @property int $parentTransactionId
 * @property array $dataJson
 *
 * @property User $user
 */
class Transaction extends \yii\db\ActiveRecord
{
    const SCENARIO_ADMIN = 'admin';
    const SCENARIO_USER = 'user';

    public static function recalculateCommonForUser($user)
    {
        // Not using yet
        return;

        $currentTime = time();
        $userId = (int)$user->id;

        // Находим последнюю транзакцию
        $lastTransaction = Transaction::find()->where(['userId' => $userId, 'isCommon' => 1, 'isPartner' => 0])->orderBy(['addedDateTime' => SORT_DESC])->limit(1)->one();

        if ($lastTransaction != null && isset($lastTransaction->dataJson['toDateTime'])) {
            $toDateUnix = Helpers::dateToUnix($lastTransaction->dataJson['toDateTime']);

            if ($toDateUnix >= strtotime('today', $currentTime)) {
                // Если последняя транзакция была сегодня
                $transaction = $lastTransaction;
            } else {
                // Иначе создаем новую
                $transaction = new Transaction();
                $transaction->userId = $userId;
                $transaction->isCommon = 1;
                $transaction->addedDateTime = Helpers::dateToSql($currentTime);
                $transaction->dataJson = [];
                $transaction->dataJson['fromDateTime'] = $lastTransaction->dataJson['toDateTime'];
            }
        } else {
            // Если нет транзакций
            $transaction = new Transaction();
            $transaction->userId = $userId;
            $transaction->isCommon = 1;
            $transaction->addedDateTime = Helpers::dateToSql($currentTime);
            $transaction->dataJson = [];
            $transaction->dataJson['fromDateTime'] = '2000-01-01 00:00:00';
        }

        $transaction->dataJson['toDateTime'] = Helpers::dateToSql($currentTime);

        // Считаем сумму в зависимости от тарифа
        if (false) {
            $commentBefore = $transaction->comment;
            $money = 83;
            $transaction->comment = 'Абонентская плата за ' . date('d.m.Y', Helpers::dateToUnix($transaction->dataJson['toDateTime'])) . '.';
            if (($transaction->isNewRecord && $user->balance > 0 && $money != 0 && $user->status == 'active') || (!$transaction->isNewRecord && ($transaction->money != $money || $transaction->comment != $commentBefore))) {
                $transaction->money = $money;
                $transaction->save(false);
            }
        } else {
            // Количество действий
            //$countActions = SomeModel::find()->where(['userId' => $userId, ['>=', 'addedDateTime', $transaction->dataJson['fromDateTime']],['<', 'addedDateTime', $transaction->dataJson['toDateTime']]])->count();
            $countActions = 0;
            $pricePerOne = 10;
            $money = -1 * $countActions * $pricePerOne;

            if (($countActions > 0 || !$transaction->isNewRecord) && $transaction->money != $money) {
                $transaction->money = $money;
                $transaction->comment = 'Оплата (' . $countActions . ' шт.).';
                $transaction->save(false);
            }
        }
    }

    public function afterSave($insert, $changedAttributes)
    {
        if ($this->user != null) {
            $this->user->updateBalance(false);
        }
        parent::afterSave($insert, $changedAttributes);
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_USER => ['id', 'userId', 'money', 'comment', 'addedDateTime', 'isPartner', 'fromInvitedUserId'],
            self::SCENARIO_ADMIN => ['id', 'userId', 'money', 'isCommon', 'comment', 'addedDateTime', 'isPartner', 'fromInvitedUserId', 'parentTransactionId', 'dataJson'],
        ];
    }

    public function behaviors()
    {
        return [
            [
                'class' => AttributeBehavior::class,
                'attributes' => [
                    ActiveRecord::EVENT_BEFORE_INSERT => 'addedDateTime',
                ],
                'value' => function ($event) {
                    return Helpers::dateToSql(time());
                },
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'transactions';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['userId', 'money'], 'required'],
            //[['userId', 'isCommon', 'isPartner', 'isRealMoney', 'fromInvitedUserId', 'parentTransactionId'], 'default', 'value' => null],
            [['userId', 'isCommon', 'isPartner', 'isRealMoney', 'fromInvitedUserId', 'parentTransactionId'], 'integer'],
            [['money'], 'number'],
            [['addedDateTime', 'dataJson'], 'safe'],
            [['comment'], 'string', 'max' => 255],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'userId' => Yii::t('app', 'ID пользователя'),
            'money' => Yii::t('app', 'Изменение баланса'),
            'isCommon' => Yii::t('app', 'Is Common'),
            'comment' => Yii::t('app', 'Комментарий'),
            'addedDateTime' => Yii::t('app', 'Дата добавления'),
            'isPartner' => Yii::t('app', 'Партнерская'),
            'isRealMoney' => Yii::t('app', 'Реальные деньги'),
            'fromInvitedUserId' => Yii::t('app', 'From Invited User ID'),
            'parentTransactionId' => Yii::t('app', 'Parent Transaction ID'),
            'dataJson' => Yii::t('app', 'Data Json'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'userId']);
    }
}
