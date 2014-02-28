<?php

define('ROOT_DIR', realpath(dirname(__FILE__) . '/../'));
ini_set('display_errors', 1);

return array(
    'db' => array(
        'host' => 'localhost',
        'name' => '',
        'user' => '',
        'password' => '',
    ),
    'base' => array(
        'vleonov.me' => '',
    ),
    'dir' => array(
        'root' => ROOT_DIR,
        'etc' => ROOT_DIR . '/etc',
        'lib' => ROOT_DIR . '/lib',
        'view' => ROOT_DIR . '/view',
        'www_tmp' => ROOT_DIR . '/www/tmp',
        'www_files' => ROOT_DIR . '/www/files',
        'var_tmp' => ROOT_DIR . '/var/tmp',
    ),
);