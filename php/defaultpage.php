<?php
require_once(dirname(__FILE__).'/../setting.php');
require_once(PATH_PHP.'functions.php');
#ページ情報の定義
$project_name = PROJECT_NAME;

$css = [
  PATH_CSS.'base.css',
  PATH_CSS.'defaultpage.css'
];
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title><?= $project_name ?> - ホーム</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
    <?= CreateCSSList($css); ?>
  </head>
  <body>
    デフォルトページです．<br>
    右上のメニューからニュースを検索してください．<br>
    また，登録及びログインすることで，好きなVTuberを選べるようになります．<br>
  </body>
</html>
