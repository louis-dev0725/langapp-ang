<?php

namespace app\components;


use yii\log\FileTarget;

class LogTargetExtension extends FileTarget {

    public $logFile;
    public $enableRotation = true;
    public $maxFileSize = 1024;
    public $maxLogFiles = 10;
    public $fileMode;
    public $dirMode = 0775;
    public $rotateByCopy = true;

}
