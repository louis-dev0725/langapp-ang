<?php

use app\models\User;
use yii\db\Migration;

/**
 * Class m201014_061328_add_test_users
 */
class m201014_061328_add_test_users extends Migration
{
    public function safeUp()
    {
        $loadTestData = isset($_SERVER['LOAD_TEST_DATA']) && $_SERVER['LOAD_TEST_DATA'] == '1';

        if ($loadTestData) {
            $user = new User();
            $user->scenario = User::SCENARIO_ADMIN;
            $user->email = 'admin@example.org';
            $user->password = 'adminpassword';
            $user->save();
            $adminRole = Yii::$app->authManager->getRole('admin');
            Yii::$app->authManager->assign($adminRole, $user->id);

            $user = new User();
            $user->scenario = User::SCENARIO_ADMIN;
            $user->email = 'user@example.org';
            $user->password = 'userpassword';
            $user->save();
        }
    }

    public function safeDown()
    {
        User::deleteAll(['email' => 'user@example.org']);
        User::deleteAll(['email' => 'admin@example.org']);
    }
}
