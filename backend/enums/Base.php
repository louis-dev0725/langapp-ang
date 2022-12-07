<?php
/**
 * @author RYU Chua <me@ryu.my>
 */

namespace app\enums;

use yii\base\BaseObject;

class Base extends BaseObject
{
    /**
     * @return array
     */
    public static function options()
    {
        return [];
    }

    /**
     * @return array
     */
    public static function values()
    {
        $options = static::options();
        return array_keys($options);
    }
}
