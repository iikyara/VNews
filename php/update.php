<?php
require_once(dirname(__FILE__).'/../setting.php');
require_once(PATH_PHP.'functions.php');

if($_SERVER["REQUEST_METHOD"] == "POST")
{
  $link = connectingMySQL();
  //セッションID
  $sessionid = $_POST['sessionid'];
  //変更対象
  $username = $_POST['username'];
  $vtid = $_POST['vtid'];
  $favorite = json_encode($_POST['favorite']);
  $history = json_encode($_POST['history']);
  //セッションIDからユーザIDを取得
  $sql = "SELECT id FROM user_info WHERE sessionid=\"$sessionid\"";
  $result = mysqli_query($link, $sql);  //実行
  //セッションIDの期限が切れていた場合(他の端末からのログイン)
  if(mysqli_num_rows($result) == 0)
  {
    echo $JSON_FAILURE;
    exit();
  }
  $info = mysqli_fetch_assoc($result);  //結果を取り出す．
  $id = $info{'id'};
  //user_infoを更新
  $sql = "UPDATE user_info SET name=\"$username\", vtid=\"$vtid\" WHERE id = $id";
  $result = mysqli_query($link, $sql);  //実行
  if(!$result)
  {
    echo $JSON_FAILURE;
    exit;
  }
  //user_favoriteを更新
  $sql = "UPDATE user_favorite SET favorite=$favorite WHERE id = $id";
  $result = mysqli_query($link, $sql);  //実行
  if(!$result)
  {
    echo $JSON_FAILURE;
    exit;
  }
  //user_historyを更新
  $sql = "UPDATE user_history SET history=$history WHERE id = $id";
  $result = mysqli_query($link, $sql);  //実行
  if(!$result)
  {
    echo $JSON_FAILURE;
    exit;
  }
  //成功
  echo $JSON_SUCCESS;
}
else {
  echo $JSON_FAILURE;
}

?>
