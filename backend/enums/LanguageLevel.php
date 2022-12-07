<?php
/**
 * @author RYU Chua <me@ryu.my>
 */

namespace app\enums;

class LanguageLevel extends Base
{
    const NEW = 'new';
    const BEGINNER = 'beginner';
    const INTERMEDIATE = 'intermediate';
    const ADVANCED = 'advanced';

    /**
     * @return array
     */
    public static function options()
    {
        return [
            static::NEW => 'New',
            static::BEGINNER => 'Beginner',
            static::INTERMEDIATE => 'Intermediate',
            static::ADVANCED => 'Advanced',
        ];
    }
}