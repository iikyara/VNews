VtuberList = [
  {name : 'kizunaai/kizunaai.pmx', light : 0x858585, image : 'kizunaai.png', position_y : -11},
  {name :'Mirai_Akari/MiraiAkari.pmx', light : 0x757575, image : 'miraiakari.png', position_y : -11},
  {name : 'weatherroid/WR_airi.pmx', light : 0xa0a0a0, image : 'weatherroid.png', position_y : -10},
  {name : 'SiroDanceCostume/siro_dance_costume.pmx', light : 0xaaaaaa, image : 'siro.png', position_y : -10},
  {name : 'Virtual/virtual.pmx', light : 0xcccccc, image : 'virtual.png', position_y : -12},
  {name : 'mokotamememe/MokotaMememe.pmx', light : 0x909090, image : 'mokotamememe.png', position_y : -11},
  {name : 'yozakuratama/YozakuraTama.pmx', light : 0x808080, image : 'yozakuratama.png', position_y : -10},
  {name : 'azmarim/azmarim.pmx', light : 0x757575, image : 'azmarim.png', position_y : -10}
];

function User(){
  this.name = '名無し';  //ユーザ名
  this.favorite = [];   //お気に入り一覧
  this.vtid = 0;      //前回選択したVTuberID
  this.vtuber = VtuberList[this.vtid];
  this.history = [];    //閲覧履歴
  this.sessionid = '';  //セッションID
  this.isLogin = false;

  //初期化
  this.Init = function(name, favorite, vtid, history, sessionid, isLogin)
  {
    this.name = name;
    this.favorite = JsonParse(favorite);
    this.vtid = vtid;
    this.vtuber = VtuberList[this.vtid];
    this.history = JsonParse(history);
    this.sessionid = sessionid;
    this.isLogin = isLogin;
    UpdatePageOnBaseUserData();
  }
  this.Init2 = function(data, isLogin)
  {
    this.Init(data.username, data.favorite, data.vtid, data.history, data.sessionid, isLogin);
  }
  //ログイン
  this.Login = function(username, password){
    //セクションIDを設定
    var sectionid = GenerateRandomString(6);
    //ajaxでログイン
    $.ajax({
      type: "POST",
      url: PROJECT_DIR + 'login/index.php',
      data: {
        username : username,
        password : sha256(sha256(password) + sectionid),
        sessionid : sectionid
      },
      success: function(data){
        console.log(data);
        var ud = JsonParse(data);
        if(!ud.success)
        {
          document.getElementById('login-message').innerHTML = 'ログインに失敗しました．';
        }
        else
        {
          //ログイン情報の格納
          user_data.Init2(ud, true);
        }
      }
    });
  };
  this.SessionLogin = function(){
    //ajaxでログイン
    $.ajax({
      type: "GET",
      url: PROJECT_DIR + 'login/index.php',
      success: function(data){
        console.log(data);
        var ud = JsonParse(data);
        if(ud.success)
        {
          user_data.Init2(ud, true);
        }
        else
        {
          UpdatePageOnBaseUserData();
        }
      }
    });
  }

  //サインアップ
  this.Signup = function(username, password){
    //登録
    $.ajax({
      type: "POST",
      url: PROJECT_DIR + 'signup/index.php',
      data: {
        "username" : username,
        "password" : sha256(password)
      },
      success: function(data){
        var ud = JsonParse(data);
        if(!data.success)
        {
          document.getElementById('signup-message').innerHTML = '既に存在するユーザ名です．';
        }
        else {
          document.getElementById('signup-message').innerHTML = '';
        }
      }
    });
  };

  //ユーザ情報更新
  this.Update = function(){
    //ログインしていなければ更新しない
    if(!this.isLogin)
    {
      return;
    }
    console.log('update');
    //登録
    $.ajax({
      type: "POST",
      url: PROJECT_DIR + 'update/index.php',
      data: {
        sessionid : this.sessionid,
        username : this.name,
        favorite : JSON.stringify(this.favorite),
        vtid : this.vtid,
        history : JSON.stringify(this.history)
      },
      success: function(data){
        console.log(data);
        var ud = JsonParse(data);
        //成功かどうか
        if(!ud.success){
          alert('ユーザ情報の更新に失敗しました．');
        }
      }
    });
  };

  //ログアウト
  this.Logout = function(){
    //フィールドを初期化
    this.name = '名無し';
    this.favorite = [];
    this.vtid = 0;
    this.vtuber = VtuberList[this.vtid];
    this.history = [];
    this.sessionid = '';  //セッションID
    this.isLogin = false;

    //ユーザ情報を送信
    this.sendUserData();
  };

  //お気に入り登録
  this.addFavorite = function(topic){
    //既に登録済みなら登録しない
    if(!this.hasFavorite(topic))
    {
      //登録
      this.favorite.push(topic);
    }
    this.Update();
    //console.log(this.hasFavorite(topic));
  };

  //お気に入り削除
  this.removeFavorite = function(topic){
    for(var i = 0; i < this.favorite.length; i++)
    {
      if(this.favorite[i] == topic)
      {
        this.favorite.splice(i, 1);
        this.removeFavorite(topic); //再帰的に実行（topicをすべて削除）
      }
    }
    this.Update();
  };

  //お気に入りが登録済みかどうか
  this.hasFavorite = function(topic){
    for(var i = 0; i < this.favorite.length; i++)
    {
      if(this.favorite[i] == topic)
      {
        return true;
      }
    }
    return false;
  };

  this.setVTuber = function(name){
    for(var i = 0; i < VtuberList.length; i++)
    {
      if(VtuberList[i].name == name)
      {
        this.vtid = i;
        break;
      }
    }
    this.vtuber = VtuberList[this.vtid];
    this.Update();
  }
}
