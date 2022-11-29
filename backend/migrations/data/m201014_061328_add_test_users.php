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
        $testAdminEmail = 'admin@example.org';
        $user = User::findByEmail($testAdminEmail);
        if ($user == null) {
            $user = new User();
            $user->name = 'Admin';
            $user->scenario = User::SCENARIO_ADMIN;
            $user->email = $testAdminEmail;
            $user->password = 'adminpassword';
            $user->paidUntilDateTime = '2030-01-01 00:00:00';
            if ($user->save()) {
                echo 'Created test admin user #' . $user->id . "\n";
            } else {
                echo 'Error: Unable to create test admin user with email ' . $testAdminEmail . '. Errors: ' . json_encode($user->errors, JSON_UNESCAPED_UNICODE) . "\n";
            }
        } else {
            echo 'Use existing test admin user #' . $user->id . "\n";
        }
        if (!empty($user->id) && !Yii::$app->authManager->checkAccess($user->id, 'admin')) {
            $adminRole = Yii::$app->authManager->getRole('admin');
            Yii::$app->authManager->assign($adminRole, $user->id);
        }

        $testUserEmail = 'user@example.org';
        $user = User::findByEmail($testUserEmail);
        if ($user == null) {
            $user = new User();
            $user->name = 'User';
            $user->scenario = User::SCENARIO_ADMIN;
            $user->email = $testUserEmail;
            $user->password = 'userpassword';
            $user->paidUntilDateTime = '2030-01-01 00:00:00';
            $user->save();
            if ($user->save()) {
                echo 'Created test non-admin user #' . $user->id . "\n";
            } else {
                echo 'Error: Unable to create test non-admin user with email ' . $testUserEmail . '. Errors: ' . json_encode($user->errors, JSON_UNESCAPED_UNICODE) . "\n";
            }
        } else {
            echo 'Use existing test user #' . $user->id . "\n";
        }
    }

    public function safeDown()
    {
        User::deleteAll(['email' => 'user@example.org']);
        User::deleteAll(['email' => 'admin@example.org']);
    }
}
