<?php

namespace app\components;

use app\models\User;
use Yii;

class Notifications
{
    /** @var User */
    protected $user;
    protected $list = [];

    /**
     * @param User $user
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * @param User $user
     * @return array
     */
    public static function getForUser($user)
    {
        $notifications = new \app\components\Notifications($user);
        $notifications->process();

        return $notifications->list;
    }

    /**
     * @param User $user
     * @param $id
     */
    public static function processClosed($user, $id)
    {
        $list = self::getForUser($user);
        $has = false;
        $canClose = false;
        foreach ($list as $item) {
            if (isset($item['id']) && $item['id'] == $id) {
                $has = true;
                $canClose = isset($item['canClose']) && $item['canClose'];
                break;
            }
        }

        if ($has && $canClose) {
            $dataJson = $user->dataJson;

            if (!isset($dataJson['closedNotifications'])) {
                $dataJson['closedNotifications'] = [];
            }

            if (!isset($dataJson['closedNotifications'][$id]) || !is_array($dataJson['closedNotifications'][$id])) {
                $dataJson['closedNotifications'][$id] = [];
            }
            $dataJson['closedNotifications'][$id]['lastDateTime'] = Helpers::dateToSql(time());
            $dataJson['closedNotifications'][$id]['count'] = isset($user->dataJson['closedNotifications'][$id]['count']) ? $user->dataJson['closedNotifications'][$id]['count'] + 1 : 1;
            $user->dataJson = $dataJson;
            $user->save(false, ['dataJson']);
        }
    }

    public function process()
    {
        //$this->lowBalance();
        //$this->test();
        $this->removeHidden();
    }

    protected function removeHidden()
    {
        $closedList = $this->user->dataJson['closedNotifications'] ?? [];
        $newList = [];
        foreach ($this->list as $item) {
            $add = false;
            if (isset($item['id'], $closedList[$item['id']])) {
                if (isset($item['enableAfter'])) {
                    $closedItem = $closedList[$item['id']];
                    if (!isset($closedItem['lastDateTime']) || (time() - Helpers::dateToUnix($closedItem['lastDateTime'])) > $item['enableAfter']) {
                        $add = true;
                    }
                } else {
                    // Skip closed
                }
            } else {
                $add = true;
            }
            if ($add) {
                if (isset($item['enableAfter'])) {
                    unset($item['enableAfter']);
                }
                $newList[] = $item;
            }
        }

        $this->list = $newList;
    }

    protected function lowBalance()
    {
        if ($this->user->balance < 300) {
            $this->list[] = ['type' => 'error', 'text' => Yii::t('app', 'Your balance is lower than 300.')];
        }
    }

    protected function test()
    {
        $this->list[] = ['id' => 'test1', 'color' => 'error', 'title' => 'Заголовок', 'text' => 'Красное уведомление.'];
        $this->list[] = ['id' => 'test2', 'color' => 'warn', 'title' => 'Заголовок', 'text' => 'Желтое уведомление.'];
        $this->list[] = ['id' => 'test3', 'color' => 'success', 'title' => 'Заголовок', 'text' => 'Зеленое уведомление.', 'canClose' => true];
        $this->list[] = ['id' => 'test4', 'color' => 'info', 'title' => 'Заголовок', 'text' => 'Синее уведомление.', 'canClose' => true];
        //$this->list[] = ['id' => 'test4', 'color' => 'info', 'title' => 'Заголовок', 'text' => 'Снова появится через 5 секунд.', 'canClose' => true, 'enableAfter' => 5];
    }
}
