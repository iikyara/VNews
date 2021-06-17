<?php
echo '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';

function g_newsxml($keywords,$max_num,$news_letters){
  // 検索フォームからデータ受信
  set_time_limit(90);
  if($keywords ==null){$keywords = "ske48";}

  if($max_num == null){$max_num = 20;}

  if($news_letters == null){$news_letters = 200;}

  // ---------------------------------------------------------------
  // グーグルニュース検索・データ取得関数 atom
  //
  //
  /* ---------------- 以下、設定部分 ------------------------------ */

  $API_BASE_URL = "https://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=atom&q=";
  /* ---------------- 以上、設定部分 ------------------------------ */
  //--------- APIへのリクエストURL生成

  $query = urlencode(mb_convert_encoding($keywords,"UTF-8", "auto"));
  $api_url = $API_BASE_URL.$query;
  //echo $api_url;
  $contents = file_get_contents($api_url);

  $xml = simplexml_load_string($contents);
  //print_r($xml);
  $i= 0;

  $data = $xml->entry;
  foreach ($data as $item) {
    $list[$i]['title'] = mb_convert_encoding($item->title ,"UTF-8", "auto");

    $description = mb_convert_encoding($item->description , "UTF-8", "auto");

    $description=strip_tags($description);

    $description= mb_strimwidth ($description,0,$news_letters, "", "UTF-8");

    $list[$i]['description'] =$description;

    $list[$i]['url'] = $item->link->attributes()->href;

    $i++;

  }

  if(count($list)>$max_num){
    for ($i = 0;
    $i < $max_num;
    $i++){
      $list_gn[$i] = $list{$i};

      $i++;

    }
  }else{
    $list_gn = $list;

  }

  //print_r($list_gn);

  return $list_gn;
}
?>
