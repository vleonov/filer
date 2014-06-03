<?php

return array(

    '/' => array(
        'Main',
    ),

    '/upload/(?<huid>[\w\d]{32})/' => array(
        'Upload',
    ),
    '/upload/(?<huid>[\w\d]{32})/save/' => array(
        'Upload' => 'save',
    ),

    '/(?<id>[a-z]{5})/' => array(
        'Upload' => 'get',
    ),
);