<?php

class C_Main extends Controller
{
    public function main()
    {
        return Response()->fetch('index.tpl');
    }
}