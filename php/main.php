<?php
require_once(dirname(__FILE__).'/../setting.php');
require_once(PATH_PHP.'functions.php');
#ページ情報の定義
$project_name = PROJECT_NAME;

$css = [
  PATH_CSS.'base.css',
  PATH_CSS.'main.css',
  PATH_CSS.'loading.css',
  PATH_CSS.'title.css',
  PATH_CSS.'contents.css',
  PATH_CSS.'menu.css',
  PATH_CSS.'vtuber.css'
];
$js = [
  PATH_JS.'userdata.js',
  PATH_JS.'functions.js',
  PATH_JS.'main.js',
  PATH_JS.'vtuber.js',
];
$three = [
  PATH_THREE.'three.js',
  PATH_THREE.'ammo.js',
  PATH_THREE.'CCDIKSolver.js',
  PATH_THREE.'charsetencoder.min.js',
  PATH_THREE.'dat.gui.min.js',
  PATH_THREE.'Detector.js',
  PATH_THREE.'EffectComposer.js',
  PATH_THREE.'MMDAnimationHelper.js',
  PATH_THREE.'MMDLoader.js',
  PATH_THREE.'mmdparser.min.js',
  PATH_THREE.'MMDPhysics.js',
  PATH_THREE.'OrbitControls.js',
  PATH_THREE.'OutlineEffect.js',
  PATH_THREE.'stats.min.js',
  PATH_THREE.'TGALoader.js',
];
$jquery = PATH_JS.'jquery-3.3.1.min.js';
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="<?= $jquery ?>" charset="utf-8"></script>
  <script src="<?= PATH_JS ?>json2.js" charset="utf-8"></script>
  <title><?= $project_name ?></title>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
  <?= CreateCSSList($css); ?>
</head>
<body>
  <div id="free1">
    <?php include(PATH_PHP.'loading.php'); ?>
  </div>
  <div id="free3">
    <?php include(PATH_PHP.'title.php'); ?>
  </div>
  <div id="free4">
    <?php include(PATH_PHP.'contents.php'); ?>
  </div>
  <div id="free5">
    <?php include(PATH_PHP.'menu.php'); ?>
  </div>
  <!--
  <div class="container1">
    <div id="area1-1">
      <?php //include(PATH_PHP.'title.php'); ?>
    </div>
    <div id="area1-2" class="container2">
      <div id="area2-1">
        <?php //include(PATH_PHP.'contents.php'); ?>
      </div>
      <div id="area2-2">
        <?php //include(PATH_PHP.'menu.php'); ?>
      </div>
    </div>
  </div>
  -->
  <div id="free2">
    <?php include(PATH_PHP.'vtuber.php'); ?>
  </div>
  <?= CreateJSList($three); ?>
  <?= CreateJSList($js); ?>
</body>
</html>
