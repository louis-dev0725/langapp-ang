<?php

use yii\db\Migration;

/**
 * Class m201014_061322_add_admin_role
 */
class m201014_061322_add_admin_role extends Migration
{
    public function up()
    {
        $role = Yii::$app->authManager->createRole('admin');
        Yii::$app->authManager->add($role);
    }

    public function down()
    {
        $role = Yii::$app->authManager->getRole('admin');
        if ($role != null) {
            Yii::$app->authManager->remove($role);
        }
    }
}
