<?php

namespace app\models\traits;

use app\exceptions\FileException;
use Exception;
use Gregwar\Image\Image;
use yii\db\ActiveRecord;
use yii\web\UploadedFile;

trait UploadFilesTrait
{
    /**
     * @param ActiveRecord $model
     * @param string $field
     * @param string $pathToFile
     *
     * @return string
     * @throws FileException
     */
    public function uploadImage(ActiveRecord $model, string $field, string $pathToFile = 'undefined'): string
    {
        $this->checkDirectory($pathToFile);

        if (!$model->$field instanceof UploadedFile) {
            throw FileException::fieldIsNotUploadFileObject($field);
        }

        /** @var UploadedFile $uploadModel */
        $uploadModel = $model->$field;
        $nameImage = time() . '.' . $uploadModel->extension;
        $path = 'upload/' . $pathToFile . '/' . $nameImage;
        try {
            Image::open($uploadModel->tempName)->save($path);
        } catch (Exception $exception) {
            throw FileException::uploadError();
        }

        return '/' . $path;
    }

    /**
     * @param string $imagePath
     * @param int $width
     * @param int $height
     * @param bool $crop
     *
     * @throws Exception
     */
    public function preview(string $imagePath, int $width = 0, int $height = 0, bool $crop = false): void
    {
        if ($imagePath[0] === '/') {
            $imagePath = substr($imagePath, 1);
        }

        $image = Image::open($imagePath);

        $explodedPath = explode('/', $imagePath);
        $filename = $explodedPath[count($explodedPath) - 1];
        $extension = $image->guessType();

        if ($width !== 0 || $height !== 0) {
            $widthNullable = $width > 0 ? $width : null;
            $heightNullable = $height > 0 ? $height : null;
            $rescale = $widthNullable === null || $heightNullable === null;
            $image = $image->resize($widthNullable, $heightNullable, 'transparent', false, $rescale, $crop);
        }

        header("Content-type: image/$extension");
        header("Cache-Control: no-store, no-cache");
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        $image->save('php://output');
        exit();
    }

    /**
     * @param string $pathToFile
     *
     * @throws FileException
     */
    private function checkDirectory(string $pathToFile): void
    {
        if (!file_exists('upload') && !mkdir('upload', 0755) && !is_dir('upload')) {
            throw FileException::directoryWasNotCreated('upload');
        }

        $path = 'upload/' . $pathToFile;
        if (!file_exists($path) && !mkdir($path, 0755) && !is_dir($path)) {
            throw FileException::directoryWasNotCreated($path);
        }
    }
}
