<?php
use yii\helpers\Html;

/** @var $model \app\models\ContactForm */
?>
<strong>ID:</strong> <?= Html::encode(Yii::$app->user->id); ?><br>
<strong>Имя:</strong> <?= Html::encode($model->name); ?><br>
<strong>E-mail:</strong> <?= Html::encode($model->email); ?><br>
<strong>Телефон:</strong> <?= Html::encode($model->telephone); ?><br>
<strong>Сообщение:</strong><br><br>

<?= nl2br(Html::encode($model->body)); ?>
