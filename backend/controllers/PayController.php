<?php

namespace app\controllers;

use app\models\Invoice;
use app\models\Transaction;
use app\models\User;
use Omnipay\RoboKassa\Gateway;
use Omnipay\RoboKassa\Message\CompletePurchaseRequest;
use Omnipay\RoboKassa\Message\CompletePurchaseResponse;
use Omnipay\RoboKassa\Message\PurchaseRequest;
use Omnipay\RoboKassa\Message\PurchaseResponse;
use Yii;
use yii\web\Controller;

class PayController extends Controller
{
    public function beforeAction($action)
    {
        if ($this->action->id == 'finish' || $this->action->id == 'result') {
            $this->enableCsrfValidation = false;
        }

        return true;
    }

    /**
     * @param bool $isSuccessPage
     * @return Gateway
     */
    protected function getGateway($isSuccessPage = false)
    {
        $gateway = new Gateway();

        if (isset(Yii::$app->params['robokassa'])) {
            $params = Yii::$app->params['robokassa'];
            if (is_array($params)) {
                if (isset($params['purse'])) {
                    $gateway->setPurse($params['purse']);
                }
                if (isset($params['secretKey'])) {
                    $gateway->setSecretKey($params['secretKey']);
                }
                if (isset($params['secretKey2'])) {
                    $gateway->setSecretKey2($params['secretKey2']);
                }
                if (isset($params['testMode']) && $params['testMode']) {
                    $gateway->setTestMode(true);
                }
            }
        }

        // Secret key 1 used on success page
        if ($isSuccessPage) {
            $gateway->setSecretKey2($gateway->getSecretKey());
        }

        return $gateway;
    }

    public function actionStart($email, $amount, $userId)
    {
        if (empty($userId)) {
            return $this->redirect('/');
        }
        $gateway = $this->getGateway();

        $invoice = new Invoice();
        $invoice->userId = $userId;
        $invoice->save(false);

        /** @var PurchaseRequest $request */
        $request = $gateway->purchase(['amount' => $amount, 'InvId' => $invoice->id, 'currency' => 'RUB', 'email' => $email, 'description' => 'Пополнение счета']);

        /** @var PurchaseResponse $response */
        $response = $request->send();
        if ($response->isRedirect()) {
            $response->redirect();
            exit();
        }
    }

    public function actionResult()
    {
        $gateway = $this->getGateway();
        /** @var CompletePurchaseRequest $request */
        $request = $gateway->completePurchase();
        /** @var CompletePurchaseResponse $response */
        $response = $request->send();

        $invoiceId = $response->getInvId();
        $invoice = Invoice::findOne($invoiceId);
        if ($invoice == null) {
            return 'Invoice not found.';
        }

        $transaction = Transaction::find()->where(['invoiceId' => $invoice->id]);
        if ($transaction == null) {
            $transaction = new Transaction();
            $transaction->money = $response->getAmount();
            $transaction->isRealMoney = 1;
            $transaction->invoiceId = $invoice->id;
            $transaction->comment = 'Пополнение через ROBOKASSA.';
            $transaction->save(false);
        }

        return 'OK' . $invoiceId;
    }
}
