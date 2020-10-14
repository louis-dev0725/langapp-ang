<?php


namespace app\components;


class Notifications extends \app\base\components\Notifications
{
    public function process()
    {
        //$this->lowBalance();
        //$this->test();
        $this->removeHidden();
    }
}
