<?php

use app\models\User;

class m221129_070000_user_dictionary_data extends yii\db\Migration
{
    public function safeUp()
    {
        $testUserEmail = 'user@example.org';
        $user = User::findByEmail($testUserEmail);
        if ($user != null) {
            $this->execute('delete from user_dictionary where dictionary_word_id in (48519, 763, 56299, 1138, 2454, 78284, 2354, 2772, 57806, 1211) and user_id = :userId', [':userId' => $user->id]);

            $userId = intval($user->id);
            $sql = "INSERT INTO user_dictionary (user_id,\"type\",dictionary_word_id,original_word,translate_word,\"date\",context,url,mnemonic_id,drill_card,drill_progress,drill_due,drill_last) VALUES
            (:user,1,48519,'見る','to see','2022-11-29','','',NULL,'{}',0,'2022-11-29 14:00:00.000 +0900','2000-01-01 09:00:00.000'),
            (:user,2,763,'見','see','2022-11-29','','',NULL,'{}',0,'2022-11-29 14:00:00.000 +0900','2000-01-01 09:00:00.000'),
            (:user,1,56299,'自分','yourself','2022-11-29','','',NULL,'{}',0,'2022-11-29 14:00:00.000 +0900','2000-01-01 09:00:00.000'),
            (:user,2,1138,'自','oneself','2022-11-29','','',NULL,'{}',0,'2022-11-29 14:00:00.000 +0900','2000-01-01 09:00:00.000'),
            (:user,2,2454,'分','part','2022-11-29','','',NULL,'{}',0,'2022-11-29 14:00:00.000 +0900','2000-01-01 09:00:00.000'),
            (:user,1,78284,'必要','needed','2022-11-29','','',NULL,'{}',0,'2022-11-29 14:00:00.000 +0900','2000-01-01 09:00:00.000'),
            (:user,2,2354,'必','invariably','2022-11-29','','',NULL,'{}',0,'2022-11-29 14:00:00.000 +0900','2000-01-01 09:00:00.000'),
            (:user,2,2772,'要','need','2022-11-29','','',NULL,'{}',0,'2022-11-29 14:00:00.000 +0900','2000-01-01 09:00:00.000'),
            (:user,1,57806,'受ける','to receive','2022-11-29','','',NULL,'{}',0,'2022-11-29 14:00:00.000 +0900','2000-01-01 09:00:00.000'),
            (:user,2,1211,'受','accept','2022-11-29','','',NULL,'{}',0,'2022-11-29 14:00:00.000 +0900','2000-01-01 09:00:00.000');";
            $this->execute(str_replace(':user', $userId, $sql));
        } else {
            echo "Test user with email $testUserEmail doesn't exists.\n";
        }
    }

    public function safeDown()
    {
        $testUserEmail = 'user@example.org';
        $user = User::findByEmail($testUserEmail);
        if ($user != null) {
            $this->execute('delete from user_dictionary where dictionary_word_id in (48519, 763, 56299, 1138, 2454, 78284, 2354, 2772, 57806, 1211) and user_id = :userId', [':userId' => $user->id]);
        }
    }
}
