<?php
require_once(dirname(__FILE__).'/../setting.php');
require_once(PATH_PHP.'functions.php');

$url = $_GET['url'];
$url = urldecode($url);
//$url = urlencode(mb_convert_encoding($url,"UTF-8", "auto"));

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//echo $api_url;
$contents = file_get_contents($url);

print_r($contents);

?>
