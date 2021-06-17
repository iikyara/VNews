<?php
require_once(dirname(__FILE__).'/../setting.php');
require_once(PATH_PHP.'functions.php');

$link = connectingMySQL();

if(isset($_COOKIE['sessionid']))
{
  $sessionid = $_COOKIE['sessionid'];
  $sql = "SELECT id, name, vtid FROM user_info WHERE sessionid = \"$sessionid\"";
  $result = mysqli_query($link, $sql);
  //セッションが見つからなかった場合
  if(mysqli_num_rows($result) == 0)
  {
    echo $JSON_FAILURE;
    exit();
  }
  //user_infoからデータを取得
  $info = mysqli_fetch_assoc($result);  //結果を取り出す．
  $id = $info{'id'};
  $username = $info{'name'};
  $vtid = $info{'vtid'};
  //user_favoriteからデータを取得
  $sql = "SELECT favorite FROM user_favorite WHERE id = $id";
  $result = mysqli_query($link, $sql);  //実行
  $info = mysqli_fetch_assoc($result);  //結果を取り出す．
  $favorite = $info{'favorite'};
  //user_historyからデータを取得
  $sql = "SELECT history FROM user_history WHERE id = $id";
  $result = mysqli_query($link, $sql);  //実行
  $info = mysqli_fetch_assoc($result);  //結果を取り出す．
  $history = $info{'history'};
  $userdata = [
    'success' => true,
    'username' => $username,
    'sessionid' => $sessionid,
    'vtid' => $vtid,
    'favorite' => $favorite,
    'history' => $history
  ];
  echo json_encode($userdata);
  exit();
}
else if($_SERVER["REQUEST_METHOD"] == "POST")
{
  //postデータの取得
  $username = $_POST['username'];
  $password = $_POST['password'];
  $sessionid = $_POST['sessionid'];
  //ログインチェック
  $sql = "SELECT * FROM user_info WHERE name = \"$username\"";
  $result = mysqli_query($link, $sql);  //実行
  $info = mysqli_fetch_assoc($result);  //結果を取り出す．
  $check_pwd = hash('sha256', $info{'password'}.$sessionid);
  if($password != $check_pwd)
  {
    //ログイン失敗
    echo $JSON_FAILURE;
    exit();
  }
  //user_infoからデータを取得
  $id = $info{'id'};
  $vtid = $info{'vtid'};
  //user_favoriteからデータを取得
  $sql = "SELECT favorite FROM user_favorite WHERE id = $id";
  $result = mysqli_query($link, $sql);  //実行
  $info = mysqli_fetch_assoc($result);  //結果を取り出す．
  $favorite = $info{'favorite'};
  //user_historyからデータを取得
  $sql = "SELECT history FROM user_history WHERE id = $id";
  $result = mysqli_query($link, $sql);  //実行
  $info = mysqli_fetch_assoc($result);  //結果を取り出す．
  $history = $info{'history'};
  //クッキーを登録（できれば）
  setcookie('sessionid', $sessionid, 0);
  //データをまとめる．
  $userdata = [
    'success' => true,
    'username' => $username,
    'sessionid' => $sessionid,
    'vtid' => $vtid,
    'favorite' => $favorite,
    'history' => $history
  ];
  echo json_encode($userdata);
  //ログインが完了したのでsessionidを登録
  $sql = "UPDATE user_info SET sessionid=\"$sessionid\" WHERE id = $id";
  if ( !mysqli_query($link, $sql) )
  {
    echo $JSON_FAILURE;
    exit();
  }
}
else {
  echo $JSON_FAILURE;
}

?>
