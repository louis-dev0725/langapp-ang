<?php

namespace app\models;

use yii\base\Model;

class UserDictionarySearch extends UserDictionary
{
    public function rules()
    {
        return [
            [['type'], 'integer'],
            [['original_word', 'translate_word'], 'string', 'max' => 255],
        ];
    }

    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }
}
