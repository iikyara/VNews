<?php
require_once('php//functions.php');

$temp = 'webapplication/VNews';

//各フォルダへのパスの定義をする
define('PATH_ROOT', $_SERVER['DOCUMENT_ROOT']);
define('PROJECT_ROOT', pathCombine(PATH_ROOT, $temp));

define('PATH_PHP', pathCombine(PROJECT_ROOT, 'php'));

define('WEB_ROOT', (empty($_SERVER["HTTPS"]) ? "http://" : "https://").$_SERVER["HTTP_HOST"]);
define('WP_ROOT', pathCombine(WEB_ROOT, $temp));

define('SRC_ROOT', pathCombine(WP_ROOT, 'src'));
define('PATH_JS', pathCombine(SRC_ROOT, 'js'));
define('PATH_THREE', pathCombine(SRC_ROOT, 'three'));
define('PATH_CSS', pathCombine(SRC_ROOT, 'css'));
define('PATH_MODELS', pathCombine(SRC_ROOT, 'models'));
define('PATH_MOTIONS', pathCombine(SRC_ROOT, 'motions'));
define('PATH_POSES', pathCombine(SRC_ROOT, 'poses'));
define('PATH_IMAGE', pathCombine(SRC_ROOT, 'image'));

define('PROJECT_NAME', 'VNews');
?>
