<?php

class C_Main extends Controller
{
    public function main()
    {
        $huid = md5(rand(1e6, 1e9) . 'HUID:SALTTY' . time());

        return Response()->assign('huid', $huid)->fetch('index.tpl');
    }
}