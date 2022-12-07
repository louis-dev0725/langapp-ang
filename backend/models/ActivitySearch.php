<?php
/**
 * @author RYU Chua <me@ryu.my>
 */

namespace app\models;

use yii\base\Model;

class ActivitySearch extends Model
{
    public $date;

    public function rules()
    {
        return [
            [['date'], 'date', 'format' => 'php:Y-m-d'],
        ];
    }
}