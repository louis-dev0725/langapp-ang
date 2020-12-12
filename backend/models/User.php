<?php


namespace app\models;


use Yii;

class User extends \app\base\models\User
{

    public function getExtensionSettings()
    {
        return $this->dataJson['extensionSettings'] ?? [];
    }

    public function setExtensionSettings($value)
    {
        if (!is_array($value)) {
            $this->addError('extensionSettings', 'extentionSettings should be an array.');
            return false;
        } else {
            $dataJson = $this->dataJson;
            $dataJson['extensionSettings'] = $value;
            $this->dataJson = $dataJson;
            return true;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function scenarios()
    {
        $scenarios = parent::scenarios();
        $scenarios[self::SCENARIO_REGISTER] = [...$scenarios[self::SCENARIO_PROFILE], 'main_language', 'language1', 'language2', 'language3'];
        $scenarios[self::SCENARIO_PROFILE] = [...$scenarios[self::SCENARIO_PROFILE], 'main_language', 'language1', 'language2', 'language3', 'extensionSettings'];
        $scenarios[self::SCENARIO_ADMIN] = [...$scenarios[self::SCENARIO_PROFILE], 'main_language', 'language1', 'language2', 'language3', 'extensionSettings'];

        return $scenarios;
    }

    /**
     * {@inheritdoc}
     */
    public function fields()
    {
        $fields = parent::fields();

        if ($this->scenario == static::SCENARIO_PROFILE) {
            $fields = array_merge($fields, ['main_language', 'language1', 'language2', 'language3', 'extensionSettings']);
        }
        if ($this->scenario == static::SCENARIO_ADMIN) {
            $fields = array_merge($fields, ['main_language', 'language1', 'language2', 'language3', 'extensionSettings']);
        }

        return $fields;
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        $rules = parent::rules();

        $rules[] = [['main_language', 'language1', 'language2', 'language3'], 'default', 'value' => null];
        $rules[] = ['extensionSettings', 'safe'];

        return $rules;
    }

    public function attributeLabels()
    {
        $labels = parent::attributeLabels();

        $labels = array_merge($labels, [
            'main_language' => Yii::t('app', 'Main language'),
            'language1' => Yii::t('app', 'Language 1'),
            'language2' => Yii::t('app', 'Language 2'),
            'language3' => Yii::t('app', 'Language 3'),
        ]);

        return $labels;
    }

    public function getHomeLanguage()
    {
        return $this->hasOne(Languages::class, ['id' => 'main_language']);
    }

    public function getLanguageOne()
    {
        return $this->hasOne(Languages::class, ['id' => 'language1']);
    }

    public function getLanguageTwo()
    {
        return $this->hasOne(Languages::class, ['id' => 'language2']);
    }

    public function getLanguageThree()
    {
        return $this->hasOne(Languages::class, ['id' => 'language3']);
    }
}
