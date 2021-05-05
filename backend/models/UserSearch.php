<?php

namespace app\models;

use yii\base\Model;

class UserSearch extends User
{
    public function rules()
    {
        return [
            [['id', 'isServicePaused', 'invitedByUserId', 'isPartner', 'enablePartnerPayments'], 'integer'],
            [['name', 'company', 'site', 'telephone', 'email', /*'passwordHash',*/ 'paidUntilDateTime', 'registerIp', 'lastLoginIp', 'addedDateTime', 'updatedDateTime', 'comment', 'restorePasswordKey', 'restorePasswordUntilDate', 'passwordChangedDateTime', 'wmr', 'dataJson', 'timezone', 'languages'], 'safe'],
            [['balance', 'balancePartner', 'partnerPercent', 'partnerEarned'], 'number'],
        ];
    }

    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }
}
