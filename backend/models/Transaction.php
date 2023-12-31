<?php

namespace app\models;

use app\components\CurrencyConverter;
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
 * @property int $invoiceId
 * @property string $currency
 * @property string $moneyBaseCurrency
 * @property int $paymentMethodId
 * @property int $status
 *
 * @property User $user
 * @property User $parentTransaction
 * @property User $childTransaction
 */
class Transaction extends \yii\db\ActiveRecord
{
    public const SCENARIO_ADMIN = 'admin';
    public const SCENARIO_USER = 'user';
    public const STATUS_ERROR = 0;
    public const STATUS_SUCCESS = 1;
    public const STATUS_PROCESS = 2;

    private static function isSaveMethod()
    {
        return in_array(Yii::$app->request->method, ['PUT', 'PATCH']);
    }

    /**
     * @param User $user user for current transaction
     */
    public function checkInvitedBy($user)
    {
        if ($user == null) {
            $user = $this->user;
        }

        if ($user != null && !$this->isNewRecord && $this->isRealMoney && $user->invitedByUserId != 0 && $user->invitedByUser != null && $this->money > 0 && $this->childTransaction == null) {
            $rTransaction = new Transaction();
            $rTransaction->money = 0;
            $rTransaction->isRealMoney = 0;
            $rTransaction->money = floor($this->money * $user->invitedByUser->partnerPercent * 100) / 100;
            $rTransaction->comment = "Партнерская программа: привлеченный клиент #{$user->id} пополнил счет на " . Helpers::formatMoney($this->money) . " руб. (операция #{$this->id}).";
            $rTransaction->isPartner = 1;
            $rTransaction->userId = $user->invitedByUserId;
            $rTransaction->fromInvitedUserId = $user->id;
            $rTransaction->parentTransactionId = $this->id;
            $rTransaction->save(false);

            $user->updatePartnerEarned();

            $user->invitedByUser->updateBalance();
        }
    }

    public static function recalculateCommonForUser($user)
    {
        // Not using yet
        return;

        $currentTime = time();
        $userId = (int) $user->id;

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

    public function getMoneyInSmallestUnit() {
        $currency = strtoupper($this->currency);
        // From https://stripe.com/docs/currencies?presentment-currency=JP#zero-decimal
        $zeroDecimalCurrencies = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];
        if (in_array($currency, $zeroDecimalCurrencies)) {
            return $this->money;
        }

        return $this->money * 100;
    }

    public function calculateToBaseCurrency()
    {
        $this->moneyBaseCurrency = $this->moneyToCurrency(User::getBaseCurrency());
    }

    public function moneyToCurrency($newCurrency)
    {
        return CurrencyConverter::convert($this->money, Helpers::dateToUnix($this->addedDateTime), $this->currency, $newCurrency);
    }

    public function beforeSave($insert)
    {
        $return = parent::beforeSave($insert);

        if ($this->currency == null) {
            $this->currency = $this->user->currency;
        }
        if ($this->isNewRecord || $this->isAttributeChanged('money') || $this->isAttributeChanged('currency')) {
            $this->calculateToBaseCurrency();
        }

        return $return;
    }

    public function afterSave($insert, $changedAttributes)
    {
        if ($this->user != null) {
            $this->checkInvitedBy($this->user);
            $this->user->updateBalance(false);
        }
        parent::afterSave($insert, $changedAttributes);
    }

    public function fields()
    {
        if (Helpers::isAdmin() && (!static::isSaveMethod())) {
            $parentFields = parent::fields();
            $parentFields['addedDateTime'] = [Helpers::class, 'formatDateField'];

            return $parentFields;
        } else {
            return ['id', 'userId', 'money', 'comment', 'addedDateTime' => [Helpers::class, 'formatDateField'], 'isPartner', 'fromInvitedUserId'];
        }
    }

    public function extraFields()
    {
        return ['user'];
    }

    public function scenarios()
    {
        $adminFields = ['id', 'userId', 'money', 'isCommon', 'comment', 'addedDateTime', 'isPartner', 'fromInvitedUserId', 'parentTransactionId', 'invoiceId', 'dataJson'];

        return [
            static::SCENARIO_USER => ['id', 'userId', 'money', 'comment', 'addedDateTime', 'isPartner', 'fromInvitedUserId'],
            static::SCENARIO_ADMIN => $adminFields,
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
            [['userId', 'isCommon', 'isPartner', 'isRealMoney', 'fromInvitedUserId', 'parentTransactionId'], 'default', 'value' => 0],
            [['userId', 'isCommon', 'isPartner', 'isRealMoney', 'fromInvitedUserId', 'parentTransactionId', 'paymentMethodId'],
                'integer', ],
            [['money'], 'number'],
            [['addedDateTime', 'dataJson'], 'safe'],
            [['comment'], 'string'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'userId' => Yii::t('app', 'User ID'),
            'money' => Yii::t('app', 'Balance change'),
            'isCommon' => Yii::t('app', 'Is Common'),
            'comment' => Yii::t('app', 'Comment'),
            'addedDateTime' => Yii::t('app', 'Added'),
            'isPartner' => Yii::t('app', 'Partner'),
            'isRealMoney' => Yii::t('app', 'Is real money'),
            'fromInvitedUserId' => Yii::t('app', 'From invited User ID'),
            'parentTransactionId' => Yii::t('app', 'Parent transaction ID'),
            'dataJson' => Yii::t('app', 'Data Json'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(\app\models\User::class, ['id' => 'userId']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getChildTransaction()
    {
        return $this->hasOne(\app\models\Transaction::class, ['parentTransactionId' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getParentTransaction()
    {
        return $this->hasOne(\app\models\Transaction::class, ['id' => 'parentTransactionId']);
    }
}
