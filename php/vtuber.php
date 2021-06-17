<?php
$models = PATH_MODELS;
$motions = PATH_MOTIONS;
$images = PATH_IMAGE;
?>

<div id="vtuber-viewer" class="vtuber">
  <div id="fukidashi" class="fukidashi">
    <div class="fukidashiBox">
      <div id="fukidashiMessage" class="fukidashiMessage">
        test
      </div>
    </div>
  </div>
  <div id="emScale"></div>
</div>
<input type="hidden" id="models-dir" value="<?= $models ?>">
<input type="hidden" id="motions-dir" value="<?= $motions ?>">
<input type="hidden" id="model-name" value="">
<input type="hidden" id="image-dir" value="<?= $images ?>">
