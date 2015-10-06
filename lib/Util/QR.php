<?php

class U_QR
{
    public static function url($url, $size = 4, $bound = 2)
    {
        self::_init();

        $filename = '/' . md5($url) . '.png';
        QRcode::png($url, Config()->dir['www_tmp'] . $filename, 'L', $size, $bound);

        return '/tmp' . $filename;
    }

    private static function _init()
    {
        include_once Config()->dir['lib'] . '/External/QR/qrlib.php';
    }
}