<?php
require_once(dirname(__FILE__).'/../setting.php');
require_once(PATH_PHP.'functions.php');

if($_SERVER["REQUEST_METHOD"] == "POST")
{
  $link = connectingMySQL();
  $username = $_POST['username'];
  $password = $_POST['password'];

  //ユーザ名の重複を許さない
  $sql = "SELECT * FROM user_info WHERE name = \"$username\"";
  $result = mysqli_query($link, $sql);
  if ( mysqli_num_rows($result) > 0 ){
    echo $JSON_FAILURE;
    exit();
  }

  //IDカウンタを取得
  $sql = "SELECT count FROM counter WHERE name = \"user_id_count\"";
  $result = mysqli_query($link, $sql);
  $count = mysqli_fetch_assoc($result);
  $count = $count{'count'} + 1;  //カウンターをインクリメント

  //ユーザ登録
  $sql = "INSERT INTO user_info(id, name, password ) VALUES($count, \"$username\", \"$password\")";
  if(!mysqli_query($link, $sql))
  {
    echo $JSON_FAILURE;
    exit();
  }

  //お気に入り登録
  $data = json_encode([]);
  $sql = "INSERT INTO user_favorite( id, favorite ) VALUES($count, \"$data\")";
  if(!mysqli_query($link, $sql))
  {
    echo $JSON_FAILURE;
    exit();
  }

  //履歴登録
  $sql = "INSERT INTO user_history( id, history ) VALUES($count, \"$data\")";
  if(!mysqli_query($link, $sql))
  {
    echo $JSON_FAILURE;
    exit();
  }

  //IDカウンタを更新
  $sql = "UPDATE counter SET count = $count WHERE name = \"user_id_count\"";
  mysqli_query($link, $sql);

  //setcookie('s', '012345', 0);
  echo $JSON_SUCCESS;
}
else {
  echo $JSON_FAILURE;
}
?>
