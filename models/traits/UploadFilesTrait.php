<?php

namespace app\models\traits;

use Yii;

trait UploadFilesTrait {

    /**
     * Функция загрузки изображения
     *
     * @param $model_name
     * @param $field
     * @param string $path_to_file
     * @param string $oldFile
     *
     * @return bool|string
     */
    public function uploadImage($model_name, $field, $path_to_file = 'undefined', $oldFile = '') {
        if (file_exists('upload')) {
            if (!file_exists('upload/' . $path_to_file)) {
                mkdir('upload/' . $path_to_file, 0755);
            }
        } else {
            mkdir('upload', 0755);
            mkdir('upload/' . $path_to_file, 0755);
        }

        if ($model_name->validate()) {
            $name_image = time() . '.' . $model_name->$field->extension;
            $new_name_image = 'upload/temp_files/' . $model_name->$field->baseName . '.' . $model_name->$field->extension;
            $new_name_image2 = 'upload/temp_files/' . $model_name->$field->baseName . '_1.' . $model_name->$field->extension;
            $path = 'upload/' . $path_to_file . '/' . $name_image;
            shell_exec('convert ' . $new_name_image . ' -auto-orient -quality 90 ' . $new_name_image2);
            shell_exec('convert ' . $new_name_image2 . ' ' . substr($name_image, 0, -4) . '_profile.icm');
            shell_exec('convert ' . $new_name_image2 . ' -strip -profile ' . substr($name_image, 0, -4) . '_profile.icm ' . $path);

            $model_name->$field->saveAs($path);

            @unlink($new_name_image);
            @unlink($new_name_image2);
            if ($oldFile != '') {
                @unlink($oldFile);
            }

            return '/' . $path;
        } else {
            return false;
        }
    }

    /**
     * Функция загрузки нескольких изображений
     *
     * @param $model_name
     * @param $field
     * @param string $path_to_file
     *
     * @return array|bool
     */
    public function uploadGallery($model_name, $field, $path_to_file = 'undefined') {
        if (file_exists('upload')) {
            if (!file_exists('upload/' . $path_to_file)) {
                mkdir('upload/' . $path_to_file, 0755);
            }
        } else {
            mkdir('upload', 0755);
            mkdir('upload/' . $path_to_file, 0755);
        }

        $arrFile = [];
        if ($model_name->validate()) {
            foreach ($model_name->$field as $key => $file) {
                $randTempNameFile = time() . '_' . preg_replace("/[^ \w]+/", "_", $file->baseName) . '.' . $file->extension;
                $randTempNameFile2 = time() . '_' . $key . '_' . preg_replace("/[^ \w]+/", "_", $file->baseName) . '.' . $file->extension;
                $name_image = time() . '.' . $file->extension;
                if ($file->type == 'image/jpeg' || $file->type == 'image/pjpeg' || $file->type == 'image/png') {
                        $new_name_image = 'upload/temp_files/' . $randTempNameFile;
						$new_name_image2 = 'upload/temp_files/' . $randTempNameFile2;
                        $path = 'upload/' . $path_to_file . '/' . $name_image;
                        shell_exec('convert ' . $new_name_image . ' -auto-orient -quality 90 ' . $new_name_image2);
						shell_exec('convert ' . $new_name_image2 . ' ' . substr($name_image, 0, -4) . '_profile.icm');
						shell_exec('convert ' . $new_name_image2 . ' -strip -profile ' . substr($name_image, 0, -4) . '_profile.icm ' . $path);
                        $file->saveAs($path);
                        $model_name->$field[$key]->saveAs($path);

                        $arrFile[$key]['type'] = 0;
                        $arrFile[$key]['path'] = $path;
                        $arrFile[$key]['name'] = $name_image;

                    @unlink($new_name_image);
					@unlink($new_name_image2);
                } else {
                    $path = 'upload/' . $path_to_file . '/' . preg_replace("/[^ \w]+/", "_", $file->baseName) . '.' . $file->extension;
                    $file->saveAs($path);
                    $model_name->$field[$key]->saveAs($path);

                    $arrFile[$key]['type'] = 1;
                    $arrFile[$key]['path'] = $path;
                    $arrFile[$key]['name'] = preg_replace("/[^ \w]+/", "_", $file->baseName);
                }
            }

            return $arrFile;
        } else {
            return false;
        }
    }
}
