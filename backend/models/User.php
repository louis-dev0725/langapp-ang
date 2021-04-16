<?php


namespace app\models;


use Yii;

/**
 * @property string[] $languages
 */
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
        $scenarios[self::SCENARIO_REGISTER] = [...$scenarios[self::SCENARIO_PROFILE], 'languages'];
        $scenarios[self::SCENARIO_PROFILE] = [...$scenarios[self::SCENARIO_PROFILE], 'languages', 'extensionSettings'];
        $scenarios[self::SCENARIO_ADMIN] = [...$scenarios[self::SCENARIO_PROFILE], 'languages', 'extensionSettings'];

        return $scenarios;
    }

    /**
     * {@inheritdoc}
     */
    public function fields()
    {
        $fields = parent::fields();

        if ($this->scenario == static::SCENARIO_PROFILE) {
            $fields = array_merge($fields, ['languages', 'extensionSettings']);
        }
        if ($this->scenario == static::SCENARIO_ADMIN) {
            $fields = array_merge($fields, ['languages', 'extensionSettings']);
        }

        return $fields;
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        $rules = parent::rules();

        //$rules[] = ['languages', 'in', 'range' => ];
        $rules[] = ['languages', 'each', 'rule' => ['string']];
        $rules[] = ['extensionSettings', 'safe'];

        return $rules;
    }

    public function attributeLabels()
    {
        $labels = parent::attributeLabels();

        $labels = array_merge($labels, [
            'languages' => Yii::t('app', 'Languages'),
        ]);

        return $labels;
    }
}
