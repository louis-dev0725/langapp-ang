<?php

namespace app\exceptions;

use Exception;
use Throwable;

class FileException extends Exception
{
    public const FIELD_IS_NOT_UPLOAD_FILE_OBJECT_CODE = 1000;
    public const FIELD_IS_NOT_UPLOAD_FILE_OBJECT_MESSAGE = 'Field %s is not yii\web\UploadedFile object';

    public const DIRECTORY_WAS_NOT_CREATED_CODE = 1100;
    public const DIRECTORY_WAS_NOT_CREATED_MESSAGE = 'Directory "%s" was not created';

    public const UPLOAD_ERROR_CODE = 1200;
    public const UPLOAD_ERROR_MESSAGE = 'Upload error';

    public static function fieldIsNotUploadFileObject(string $field, Throwable $previous = null): self
    {
        return new self(
            sprintf(self::FIELD_IS_NOT_UPLOAD_FILE_OBJECT_MESSAGE, $field),
            self::FIELD_IS_NOT_UPLOAD_FILE_OBJECT_CODE,
            $previous
        );
    }

    public static function directoryWasNotCreated(string $directory, Throwable $previous = null): self
    {
        return new self(
            sprintf(self::DIRECTORY_WAS_NOT_CREATED_MESSAGE, $directory),
            self::DIRECTORY_WAS_NOT_CREATED_CODE,
            $previous
        );
    }

    public static function uploadError(Throwable $previous = null): self
    {
        return new self(self::UPLOAD_ERROR_MESSAGE, self::DIRECTORY_WAS_NOT_CREATED_CODE, $previous);
    }
}
