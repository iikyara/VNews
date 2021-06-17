<?php
require_once(dirname(__FILE__).'/../setting.php');
require_once(PATH_PHP.'functions.php');

//$API_BASE_URL = "https://news.google.com/news/rss/headlines/section/q/android%20%E3%82%BF%E3%83%96%E3%83%AC%E3%83%83%E3%83%88/android%20%E3%82%BF%E3%83%96%E3%83%AC%E3%83%83%E3%83%88";
$API_BASE_URL = "https://news.google.com/news/rss/headlines/section/";
$API_OPTION = "?ned=jp&hl=ja&gl=JP";

$mode = $_GET['m'];
//デフォルトurl
$api_url = "https://news.google.com/news/rss/headlines/section/q/vtuber/vtuber";
if($mode == 'search')
{
  $keywords = $_GET['q'];
  $query = urlencode(mb_convert_encoding($keywords,"UTF-8", "auto"));

  $q1 = 'q';
  $q2 = $query;
  $q3 = $query;

  $rq2 = $query;
  $rq3 = $query;
}
else if($mode == 'topic')
{
  $name = $_GET['n'].'.ja_jp';
  $jpname = urlencode(mb_convert_encoding($_GET['jn'],"UTF-8", "auto"));

  $q1 = 'topic';
  $q2 = $name;
  $q3 = $jpname;

  $rq2 = $_GET['n'];
  $rq3 = $_GET['jn'];
}
else
{
  $q1 = 'q';
  $q2 = 'vtuber';
  $q3 = 'vtuber';

  $mode = 'search';
  $rq2 = $q2;
  $rq3 = $q3;
}
$api_url = $API_BASE_URL.$q1.'/'.$q2.'/'.$q3.$API_OPTION;

//echo $api_url;
$contents = file_get_contents($api_url);
$xml = simplexml_load_string($contents);
$xml['mode'] = $mode;
$xml['q2'] = $rq2;
$xml['q3'] = $rq3;
$json = json_encode($xml);

print_r($json);

?>
