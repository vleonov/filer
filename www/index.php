<?php

require_once __DIR__ . '/../lib/External/Smarty/Smarty.class.php';
require_once __DIR__ . '/../lib/fx/Bootstrap.php';

$configFilename = dirname(__FILE__) . '/../etc/config.php';
Bootstrap::run($configFilename);
