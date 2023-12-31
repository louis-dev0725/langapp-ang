<?php

namespace app\models;

use app\components\Helpers;
use JsonException;
use Square\Environment;
use Square\Models\CreatePaymentRequest;
use Square\Models\CreatePaymentResponse;
use Square\Models\Currency;
use Square\Models\Money;
use Square\SquareClient;
use Throwable;
use Yii;
use yii\base\Exception;
use yii\db\ActiveQuery;
use yii\web\ServerErrorHttpException;

/**
 * This is the model class for table "payment_methods".
 *
 * @property int $id
 * @property int $userId
 * @property string $type
 * @property string $title
 * @property boolean $isActive
 * @property boolean $isDeleted
 * @property string $addedDateTime
 * @property array $data
 */
class PaymentMethod extends \yii\db\ActiveRecord
{
    public const TYPE_SQUARE = 'square';
    public const TYPE_STRIPE = 'stripe';

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'payment_methods';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [];
    }

    public function fields()
    {
        return ['id', 'userId', 'type', 'title'];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'userId' => 'User ID',
            'data' => 'Data',
        ];
    }

    /**
     * @return ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'userId']);
    }

    /**
     * @return ActiveQuery
     */
    public function getTransactions(): ActiveQuery
    {
        return $this->hasMany(Transaction::class, ['paymentMethodId' => 'id'])
            ->onCondition(['userId' => $this->userId]);
    }

    /**
     * @param float $amount
     * @param string $currency
     * @return Transaction
     * @throws ServerErrorHttpException
     * @throws JsonException
     * @throws Exception
     */
    public function debitFunds(float $amount, string $currency): Transaction
    {
        $transaction = new Transaction([
            'money' => $amount,
            'currency' => $currency,
            'userId' => $this->userId,
            'status' => Transaction::STATUS_PROCESS,
            'isRealMoney' => 1,
            'addedDateTime' => Helpers::dateToSql(time()),
            'paymentMethodId' => $this->id,
            'scenario' => Transaction::SCENARIO_USER,
            'comment' => $this->title,
        ]);

        if (!$transaction->save()) {
            throw new ServerErrorHttpException('Unable to create transaction to debit funds.');
        }

        Yii::info('Trying to debit funds. Transaction: ' . json_encode($transaction->attributes, JSON_THROW_ON_ERROR));

        if ($this->type == self::TYPE_STRIPE) {
            $stripeParams = Yii::$app->params['stripe'];
            $env = $stripeParams['env'] ?? 'sandbox';
            \Stripe\Stripe::setApiKey($stripeParams[$env]['secretKey']);

            try {
                $result = \Stripe\PaymentIntent::create([
                    'amount' => $transaction->getMoneyInSmallestUnit(),
                    'currency' => $transaction->currency,
                    'customer' => $this->data['customer'],
                    'payment_method' => $this->data['id'],
                    'off_session' => true,
                    'confirm' => true,
                ]);
                $transaction->status = Transaction::STATUS_SUCCESS;
                $transaction->dataJson = array_merge($transaction->dataJson ?? [], ['paymentIntent' => $result->toArray()]);
            } catch (\Stripe\Exception\CardException $e) {
                // Error code will be authentication_required if authentication is needed
                // $payment_intent_id = $e->getError()->payment_intent->id;
                // $payment_intent = \Stripe\PaymentIntent::retrieve($payment_intent_id);

                Yii::info("Transaction error. Error code: {$e->getError()->code} Details: {$e->getError()->toJSON()}");
                $transaction->status = Transaction::STATUS_ERROR;
                $transaction->dataJson = array_merge($transaction->dataJson ?? [], ['error' => $e->getMessage(), 'errorData' => $e->getError()->toArray(), 'trace' => $e->__toString()]);
            } catch (\Exception $e) {
                Yii::info("Transaction error: {$e->__toString()}");
                $transaction->status = Transaction::STATUS_ERROR;
                $transaction->dataJson = array_merge($transaction->dataJson ?? [], ['error' => $e->getMessage(), 'trace' => $e->__toString()]);
            }
        } elseif ($this->type == self::TYPE_SQUARE) {
            $squareParams = Yii::$app->params['square'];
            $env = $squareParams['env'] ?? 'sandbox';
            $squareClient = new SquareClient([
                'accessToken' => $squareParams[$env]['accessToken'],
                'environment' => $squareParams[$env]['accessToken'] === 'production' ? Environment::PRODUCTION : Environment::SANDBOX,
            ]);

            $money = new Money();
            // Set amount of money to be always a positive value.
            $money->setAmount(abs($transaction->moneyToCurrency('JPY')));
            // Set currency to be the JPY always.
            $money->setCurrency(Currency::JPY);

            $paymentRequest = new CreatePaymentRequest(
                $this->data['id'],
                Yii::$app->security->generateRandomString(16),
                $money
            );
            $paymentRequest->setCustomerId($this->data['customerId']);

            try {
                $response = $squareClient->getPaymentsApi()->createPayment($paymentRequest);
                if ($response->isError()) {
                    throw new Exception("Payment is unsuccessful. Error from Square: {$response->getBody()}");
                }

                /** @var CreatePaymentResponse $result */
                $result = $response->getResult();
                $payment = $result->getPayment();
                if ($payment === null) {
                    throw new Exception("Payment is null. Response from Square: {$response->getBody()}");
                }

                $paymentStatus = $payment->getStatus();
                if ($paymentStatus === null) {
                    throw new Exception("Payment status is null. Response from Square: {$response->getBody()}");
                }

                if ($paymentStatus === 'COMPLETED') {
                    $transaction->status = Transaction::STATUS_SUCCESS;
                }
            } catch (Throwable $e) {
                Yii::info("Transaction error: {$e->getMessage()}");
                $transaction->status = Transaction::STATUS_ERROR;
                $transaction->dataJson = array_merge($transaction->dataJson ?? [], ['error' => $e->getMessage()]);
            }
        } else {
            $transaction->status = Transaction::STATUS_ERROR;
            $transaction->dataJson = array_merge($transaction->dataJson ?? [], ['error' => 'Unknown payment method.']);
        }

        $transaction->save(false);

        return $transaction;
    }

    /**
     * Has this payment method a faulty transactions in last 24 hours?
     * @return bool
     */
    public function hasFaultyTransactionsInLast24h(): bool
    {
        $timeNow = time();
        $oneDayUnix = 3600 * 24;

        return $this->getTransactions()
            ->andOnCondition([
                'and',
                ['status' => Transaction::STATUS_ERROR],
                [
                    'between',
                    'addedDateTime',
                    Helpers::dateToSql($timeNow - $oneDayUnix),
                    Helpers::dateToSql($timeNow),
                ],
            ])
            ->exists();
    }
}
