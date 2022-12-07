<?php
/**
 * @author RYU Chua <me@ryu.my>
 */

namespace app\enums;

class UserTariff extends Base
{
    const FREE = 'free';
    const MONTHLY = 'monthly';
    const YEARLY = 'yearly';

    public static function options()
    {
        return [
            static::FREE => 'Free',
            static::MONTHLY => 'Monthly',
            static::YEARLY => 'Yearly',
        ];
    }
}