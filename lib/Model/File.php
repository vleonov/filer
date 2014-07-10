<?php

/**
 * @property int $id
 * @property string $uploadId
 * @property string $path
 * @property string $name
 * @property int $size
 * @property string $mime
 * @property string $type
 * @property array $tags
 * @property int $sorting
 */
class M_File extends Model
{
    protected $_tblName = 'filer_files';
    protected $_customTypes = array(
        'tags' => Database::TYPE_JSON,
    );
}