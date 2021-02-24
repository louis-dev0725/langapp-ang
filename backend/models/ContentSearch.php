<?php

namespace app\models;

use yii\base\Model;

class ContentSearch extends Content
{
    public function rules()
    {
        return [
            [['type', 'status', 'length', 'level', 'deleted'], 'integer'],
            [['text', 'cleanText'], 'string'],
            [['tagsJson'], 'safe'],
            [['title', 'sourceLink', 'format'], 'string', 'max' => 255],
        ];
    }

    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }
}
