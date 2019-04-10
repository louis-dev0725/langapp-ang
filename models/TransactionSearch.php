<?php

namespace app\models;

use yii\base\Model;

class TransactionSearch extends Transaction
{
    public function rules()
    {
        return [
            [['id', 'userId', 'isCommon', 'isPartner', 'isRealMoney', 'fromInvitedUserId', 'parentTransactionId'], 'integer'],
            [['money'], 'number'],
            [['comment', 'addedDateTime', 'dataJson'], 'safe'],
        ];
    }

    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }
}
