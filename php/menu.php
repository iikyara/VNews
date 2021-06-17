<?php

?>
<!-- サイドオープン時メインコンテンツを覆う -->
<div class="overlay" id="js__overlay"></div>

<!-- サイドメニュー -->
<nav id="side-menu" class="side-menu">
  <!-- トピック一覧を入れる -->
  <ul id="topicsList" class="topicsList">
  </ul>
</nav>

<div id="side-under-menu" class="side-under-menu">
  <div id="topicTitle" class="topicTitle">
    トピックタイトル
  </div>
  <div id="addFavorite" class="addFavorite">
    お気に入り追加
  </div>
  <div id="searchZone" class="searchZone">
    <input type="text" id="searchKeyWords" value="VTuber">
    <button type="button" id="searchButton">
      <i class="fas fa-search"></i>
    </button>
  </div>
  <div id="topicName" style="display:none;">
    init
  </div>
  <!-- トピックごとのニュース一覧を入れる -->
  <div id="newsList" class="newsList">
  </div>
</div>

<!-- 開閉用ボタン -->
<div class="side-menu-btn" id="js__sideMenuBtn">
  <i class="fas fa-bars"></i>
</div>

<!--
<div id="menu" class="menu">
MENU
<div id="search">
none
</div>

</div>
-->
