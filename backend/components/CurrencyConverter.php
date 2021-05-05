<?php


namespace app\components;

use Yii;

class CurrencyConverter
{
    protected static function getRatesForDateRub($fromCurrency, $unixTime)
    {
        $date = date('d/m/Y', $unixTime);
        $rates = Yii::$app->cache->getOrSet('currency-rates-' . $date . '-5', function () use ($date) {
            $rawResult = file_get_contents('http://www.cbr.ru/scripts/XML_daily.asp?date_req=' . $date);
            $tmpResult = json_decode(json_encode(simplexml_load_string($rawResult)), true);
            $result = [];
            if (!isset($tmpResult['Valute'])) {
                return [];
            }
            foreach ($tmpResult['Valute'] as $item) {
                $value = floatval(str_replace(',', '.', $item['Value']));
                if (isset($item['Nominal']) && $item['Nominal'] != '1') {
                    $value /= $item['Nominal'];
                }
                $result[$item['CharCode']] = $value;
            }

            return $result;
        });

        if (isset($rates[$fromCurrency])) {
            return $rates[$fromCurrency];
        } else {
            throw new \RuntimeException('From currency ' . $fromCurrency . ' is not supported (for date ' . $date . ')');
        }
    }

    public static function convert($money, $unixTime, $fromCurrency, $toCurrency)
    {
        if ($fromCurrency == $toCurrency) {
            return $money;
        }

        $rate = null;
        if ($toCurrency == 'RUB') {
            $rate = self::getRatesForDateRub($fromCurrency, $unixTime);
        } else {
            throw new \RuntimeException('Target currency ' . $toCurrency . ' is not supported yet.');
        }

        return $money * $rate;
    }
}