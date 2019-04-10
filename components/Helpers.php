<?php


namespace app\components;


class Helpers
{
    public static function dateToSql($unixTime)
    {
        return date("Y-m-d H:i:s", $unixTime);
    }

    public static function dateToUnix($sqlDate)
    {
        return strtotime($sqlDate);
    }

    public static function isAdmin() {
        return \Yii::$app->user->can('admin');
    }
}
