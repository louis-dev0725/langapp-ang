<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $user app\models\User */
$resetLink = $user->getRestorePasswordLink();
?>
<div class="password-reset">
    <p>Добрый день.</p>

    <p>Вы создали запрос на восстановление пароля.</p>

    <p>Для восстановления пароля перейдите по ссылке:</p>

    <p><?= Html::a(Html::encode($resetLink), $resetLink) ?></p>

    <p>Если вы не создавали данный запрос, просто проигнорируйте данное письмо.</p>
</div>
