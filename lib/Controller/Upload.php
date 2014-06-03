<?php

class C_Upload extends Controller
{
    public function main()
    {
        $huid = Request()->args('huid');
        $basedir = Config()->dir['www'];

        $result = array();
        if (isset($_FILES['files'])) {
            $uploaded = $_FILES['files'];
            for ($i = 0, $ci = sizeof($uploaded['name']); $i<$ci; $i++) {

                $result[$i] = array(
                    'name' => $uploaded['name'][$i],
                    'size' => $uploaded['size'][$i],
                );

                if (empty($uploaded['tmp_name'][$i])
                    || !is_uploaded_file($uploaded['tmp_name'][$i])
                    || $uploaded['error'][$i] != UPLOAD_ERR_OK
                ) {
                    $result[$i]['error'] = $uploaded['error'][$i];
                }

                $filedir = 'files/' . $huid;
                $filename = $basedir . '/' . $filedir . '/' . $uploaded['name'][$i];
                $s = 0;
                while (file_exists($filename) && md5_file($filename) != md5_file($uploaded['tmp_name'][$i])) {
                    $filedir = 'files/' . $huid . '/' . ++$s;
                    $filename = $basedir . '/' . $filedir . '/' . $uploaded['name'][$i];
                }

                U_Misc::mkdir($basedir . '/' . $filedir);
                move_uploaded_file($uploaded['tmp_name'][$i], $filename);

                $result[$i]['url'] = $filedir . '/' . $uploaded['name'][$i];

                if (U_Image::is($filename)) {
                    $thumbFiledir = 'thumbs/' . $huid . ($s ? '/' . $s : '');
                    U_Misc::mkdir($basedir . '/' . $thumbFiledir);

                    U_Image::resize(
                        $filename,
                        $basedir . '/' . $thumbFiledir . '/' . $uploaded['name'][$i],
                        PHP_INT_MAX,
                        113
                    );

                    $result[$i]['thumbUrl'] = $thumbFiledir . '/' . $uploaded['name'][$i];

                    $previewFiledir = 'previews/' . $huid . ($s ? '/' . $s : '');
                    U_Misc::mkdir($basedir . '/' . $previewFiledir);

                    U_Image::resize(
                        $filename,
                        $basedir . '/' . $previewFiledir . '/' . $uploaded['name'][$i],
                        800,
                        600
                    );
                }
            }
        }

        return Response()->assign('result', $result)->fetch('upload.tpl');
    }

    public function save()
    {
        $huid = Request()->args('huid');

        $mUpload = new M_Upload();
        $mUpload->huid = $huid;
        $mUpload->createdAt = date(DATE_W3C, time());
        $mUpload->finishAt = date(DATE_W3C, time() + 86400);

        $id = $mUpload->save();

        $basedir = Config()->dir['www'];
        $filedir = 'files/' . $mUpload->huid;

        $files = U_Misc::rddir($basedir . '/' . $filedir);

        foreach ($files as $filename) {
            $mFile = new M_File();
            $mFile->uploadId = $id;
            $mFile->path = $filename;
            $mFile->name = basename($filename);
            $mFile->size = filesize($basedir . '/' . $filedir . '/' . $filename);
            $mFile->mime = mime_content_type($basedir . '/' . $filedir . '/' . $filename);
            switch ($mFile->mime) {
                case 'image/jpg':
                case 'image/jpeg':
                case 'image/png':
                case 'image/gif':
                    $meta = getimagesize($basedir . '/' . $filedir . '/' . $filename);
                    if ($meta[0] >= 800 && $meta[1] >= 800) {
                        $mFile->type = 'photo';
                    } else {
                        $mFile->type = 'image';
                    }
                    break;
            }
            $mFile->save();
        }

        return Response()->redirect($id);
    }

    public function get()
    {
        $id = Request()->args('id');

        $mUpload = new M_Upload($id);

        if (!$mUpload || strtotime($mUpload->finishAt) < time()) {
            return Response()->assign('errorText', 'the requested files do not found')->error404();
        }

        $lFiles = new L_Files(array('uploadId' => $id));

        $result = array();
        $isImageOnly = true;
        $isPhotoOnly = true;

        /** @var $mFile M_File */
        foreach ($lFiles as $mFile) {

            $file = array(
                'name' => $mFile->name,
                'size' => $mFile->size,
                'type' => $mFile->type,
                'url' => 'files/' . $mUpload->huid . '/' . $mFile->path,
            );

            $isPhoto = $mFile->type == 'photo';
            $isImage = $mFile->type == 'image' || $isPhoto;
            if ($isImage) {
                $file += array(
                    'thumbUrl' => 'thumbs/' . $mUpload->huid . '/' . $mFile->path,
                    'previewUrl' => 'previews/' . $mUpload->huid . '/' . $mFile->path,
                );
            }

            $result[] = $file;
            $isImageOnly &= $isImage;
            $isPhotoOnly &= $isPhoto;
        }

        $r = array(
            'fileList' => $result,
            'isImageOnly' => $isImageOnly,
            'isPhotoOnly' => $isPhotoOnly,
        );

        return Response()->assign($r)->fetch('upload/files.tpl');
    }
}