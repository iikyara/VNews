//------------------------------------------------------
// 部品の読み込み
//------------------------------------------------------
var elem_area11 = document.getElementById('area1-1');
var elem_area12 = document.getElementById('area1-2');
var elem_area21 = document.getElementById('area2-1');
var elem_area22 = document.getElementById('area2-2');

var elem_title = document.getElementById('title');
var elem_contents = document.getElementById('contents');
var elem_menu = document.getElementById('menu');

var elem_topics_list = document.getElementById('topicsList');
var elem_topic_title = document.getElementById('topicTitle');
var elem_news_list = document.getElementById('newsList');
var elem_add_favorite = document.getElementById('addFavorite');
var elem_topic_name = document.getElementById('topicName');
var elem_search_zone = document.getElementById('searchZone');
var elem_search_key_words = document.getElementById('searchKeyWords');
var elem_search_button = document.getElementById('searchButton');

//動的に作成して後から読み込む部品
var elem_favorite_list;

//------------------------------------------------------
// 各種定数の定義（別ファイルで記述してもいいかもしれない）
//------------------------------------------------------
var TOPICS = [
  {name:'NATION', jpname:'日本', icon:'fas fa-flag'},
  {name:'WORLD', jpname:'国際', icon:'fas fa-globe'},
  {name:'BUSINESS', jpname:'ビジネス', icon:'fas fa-building'},
  {name:'POLITICS', jpname:'政治', icon:'fas fa-landmark'},
  {name:'ENTERTAINMENT', jpname:'エンタメ', icon:'fas fa-film'},
  {name:'SPORTS', jpname:'スポーツ', icon:'fas fa-running'},
  {name:'SCITECH', jpname:'テクノロジー', icon:'fas fa-flask'}
];
var MENU = [
  {name:'FAVORITE', jpname:'お気に入り', icon:'fas fa-star'},
  {name:'SEARCH', jpname:'検索', icon:'fas fa-search'},
  {name:'LOGIN', jpname:'ログイン', icon:'fas fa-sign-in-alt'},
  {name:'LOGOUT', jpname:'ログアウト', icon:'fas fa-sign-out-alt'},
  {name:'SELECTVT', jpname:'VTuber選択', icon:'fas fa-id-badge'}
];
var CSSCLASS = {
  main:{
    base : 'main'
  },
  title:{
    base : 'title'
  },
  menu:{
    base : 'menu',
    newsItem : 'news_item',
    topicItem : 'topic_item',
    login : 'login'
  },
  contents:{
    base : 'contents'
  }
};
var PROJECT_DIR = "/webapplication/VNews/";

//------------------------------------------------------
// 変数の定義
//------------------------------------------------------
/* 各トピックのニュースのリスト */
var current_menu = MENU[1].name;  //初期値：SEARCH
var all_news = {};

/* ユーザ情報 */
var user_data = new User();

//------------------------------------------------------
// ページが読み込まれたときの処理
//------------------------------------------------------
window.onload = function(){
  windowresize();
  CreateMenu();

  LoadNews();

  //cookie：urlを探す
  var cookies = document.cookie.split(';');
  var vtuber = VtuberList[0].name;
  for(var i = 0; i < cookies.length; i++)
  {
    var temp = cookies[i].split('=');
    console.log(temp[0]);
    if(temp[0].trim() == 'url')
    {
      console.log('cookie:url');
      UpdateNewsPage(decodeURIComponent(temp[1].trim()));
    }
    else if(temp[0].trim() == 'vtuber')
    {
      console.log('cookie:vtuber');
      vtuber = decodeURIComponent(temp[1].trim());
    }
  }

  //動的に作成した部品の読み込み
  elem_favorite_list = document.getElementById('favorite_list');

  //セッションからログイン
  user_data.SessionLogin();

  user_data.setVTuber(vtuber);

  UpdatePageOnBaseUserData()
}

//ロード用コード（バグあり）
/*
$(function() {
  var h = $(window).height();

  $('#wrap').css('display','none');
  $('#loader-bg ,#loader').height(h).css('display','block');
});

$(window).load(function () { //全ての読み込みが完了したら実行
  $('#loader-bg').delay(900).fadeOut(800);
  $('#loader').delay(600).fadeOut(300);
  $('#wrap').css('display', 'block');
});

//10秒たったら強制的にロード画面を非表示
$(function(){
  setTimeout('stopload()',10000);
});

function stopload(){
  $('#wrap').css('display','block');
  $('#loader-bg').delay(900).fadeOut(800);
  $('#loader').delay(600).fadeOut(300);
}
*/

//------------------------------------------------------
// リスナー
//------------------------------------------------------
window.onresize = function(){
  windowresize();
}

//スマホスクロール禁止用（できてない）
$(window).on('touchmove.noScroll', function(e) {
    e.preventDefault();
});

$(function () {
  //メニューオープンボタンの動作
  var $body = $('body');
  $('#js__sideMenuBtn').on('click', function () {
    $body.toggleClass('side-open');
    if($body.hasClass('side-open'))
    {
      $('#free2').animate({'right':'600px'}, 500);
    }
    else
    {
      $('#free2').animate({'right':'0px'}, 500);
    }
    $('#js__overlay').on('click', function () {
      $body.removeClass('side-open');
      $('#free2').animate({'right':'0px'}, 500);
    });
  });
});

elem_add_favorite.addEventListener('click', function(){
  var topic = elem_topic_name.innerHTML;
  if(user_data.hasFavorite(topic))
  {
    RemoveFavorite(topic);
  }
  else
  {
    RegistFavorite(topic);
  }
  ControlFavoriteButton(topic);
}, false);

elem_search_button.addEventListener('click', function(){
  var key = elem_search_key_words.value;
  getNews(key);
}, false);

//------------------------------------------------------
// メソッド
//------------------------------------------------------
/*
 * メニューを作る(初期処理)
 */
function CreateMenu(){
  //お気に入り
  /*
  var favorite = CreatePullDownMenuElement(MENU[0]);
  var favorite_list = document.createElement('ul');
  favorite_list.id = 'favorite_list';
  favorite_list.classList.add('favorite_list');
  favorite.appendChild(favorite_list);
  elem_topics_list.appendChild(favorite);
  elem_topics_list.appendChild(document.createElement('br'));
  */

  //検索
  elem_topics_list.appendChild(CreateMenuElement(MENU[1]));
  elem_topics_list.appendChild(document.createElement('br'));
  //トピックス
  for(var i = 0; i < TOPICS.length; i++)
  {
    var elem = CreateMenuElement(TOPICS[i]);
    elem_topics_list.appendChild(elem);
    elem_topics_list.appendChild(document.createElement('br'));
  }
  //ログインorログアウト
  if(!user_data.isLogin)
  {
    elem_topics_list.appendChild(CreateMenuElement(MENU[2]));
    elem_topics_list.appendChild(document.createElement('br'));
  }
  else
  {
    elem_topics_list.appendChild(CreateMenuElement(MENU[3]));
    elem_topics_list.appendChild(document.createElement('br'));
  }
  elem_topics_list.appendChild(CreateMenuElement(MENU[4]));
  elem_topics_list.appendChild(document.createElement('br'));
}

/*
 * トピックメニューの一要素を作る．
 */
function CreateMenuElement(topic){
  //1つの要素
  var li = document.createElement('li');
  li.id = topic.name;
  //アイコンの設定
  var icon = document.createElement('div');
  icon.classList.add('icon');
  var i = document.createElement('i');
  var icon_class = topic.icon.split(' ');
  for(var n = 0; n < icon_class.length; n++)
  {
    i.classList.add(icon_class[n]);
  }
  icon.appendChild(i);
  //トピック見出しの設定
  var div = document.createElement('div');
  div.classList.add('topic-title');
  div.innerHTML = topic.jpname;
  //仮想的な要素でラップする
  var wrapper = document.createElement('div');
  wrapper.classList.add('topic-wrapper');
  wrapper.id = topic.name;
  //まとめる
  li.appendChild(icon);
  li.appendChild(div);
  li.appendChild(wrapper);
  //リスナーの設定
  li.addEventListener('click', ClickMenuElement, false);

  return li;
}

function CreatePullDownMenuElement(topic){
  //1つの要素
  var li = document.createElement('li');
  li.classList.add('pull-down-list');
  //li.id = topic.name;
  //アイコンの設定
  var icon = document.createElement('div');
  icon.classList.add('icon');
  var i = document.createElement('i');
  var icon_class = topic.icon.split(' ');
  for(var n = 0; n < icon_class.length; n++)
  {
    i.classList.add(icon_class[n]);
  }
  icon.appendChild(i);
  //トピック見出しの設定
  var div = document.createElement('div');
  div.classList.add('topic-title');
  div.innerHTML = topic.jpname;
  //仮想的な要素でラップする
  var wrapper = document.createElement('div');
  wrapper.classList.add('topic-wrapper');
  wrapper.id = topic.name;
  //まとめる
  li.appendChild(icon);
  li.appendChild(div);
  li.appendChild(wrapper);

  //リスナーの設定
  li.addEventListener('click', ClickPullDownMenuElement, false);

  return li;
}

/*
 * トピックがクリックされたときの動作
 */
function ClickMenuElement(){
  //クリックされた要素
  var target = event.target;
  //タイトルとニュース一覧を更新
  for(var i = 0; i < TOPICS.length; i++)
  {
    if(TOPICS[i].name == target.id)
    {
      elem_topic_title.innerHTML = TOPICS[i].jpname;
    }
  }
  for(var i = 0; i < MENU.length; i++)
  {
    if(MENU[i].name == target.id)
    {
      elem_topic_title.innerHTML = MENU[i].jpname;
    }
  }

  elem_news_list.textContent = null;
  elem_news_list.appendChild(all_news[target.id]);
  if(target.id == 'SEARCH')
  {
    elem_search_zone.style.display = "block";
  }
  else
  {
    elem_search_zone.style.display = "none";
  }
  //メニューを遷移させる
  if(!$('#side-menu').hasClass('change-menu'))
  {
    $('#side-menu').toggleClass('change-menu');
  }
  //pulldownmenuを非アクティブにする
  if($('#FAVORITE').hasClass('pull-down-active'))
  {
    $('#FAVORITE').toggleClass('pull-down-active');
  }

  //お気に入りボタンの操作
  ControlFavoriteButton(target.id);

  //トピック名を伝える．
  elem_topic_name.innerHTML = target.id;
}

/*
 * お気に入り登録ボタンの操作
 */
function ControlFavoriteButton(topic){
  var flag = false;
  for(var i = 0; i < TOPICS.length; i++)
  {
    if(TOPICS[i].name == topic)
    {
      flag = true;
    }
  }
  if(flag)
  {
    if(user_data.hasFavorite(topic))
    {
      //elem_add_favorite.innerHTML = 'お気に入り削除';
      elem_add_favorite.innerHTML = '';
    }
    else
    {
      //elem_add_favorite.innerHTML = 'お気に入り追加';
      elem_add_favorite.innerHTML = '';
    }
  }
  else
  {
    elem_add_favorite.innerHTML = '';
  }
}

/*
 * プルダウンメニューがクリックされたときの動作
 */
function ClickPullDownMenuElement(){
  //メニューを遷移させる
  if($('#side-menu').hasClass('change-menu'))
  {
    $('#side-menu').toggleClass('change-menu');
  }
  //pulldownmenuをアクティブにする
  if($('#FAVORITE').hasClass('pulll-down-list'))
  {
    $('#FAVORITE').removeClass('pull-down-list');
    $('#FAVORITE').toggleClass('pull-down-list-active');
  }
  else if($('#FAVORITE').hasClass('pulll-down-list-active'))
  {
    $('#FAVORITE').toggleClass('pull-down-list');
    $('#FAVORITE').removeClass('pull-down-list-active');
  }
}

/*
 * 各トピックのニュース一覧を作成
 */
function LoadNews(){
  for(var i = 0; i < TOPICS.length; i++)
  {
    var topic = TOPICS[i];
    var name = encodeURIComponent(topic.name);
    var jpname = encodeURIComponent(topic.jpname);
    query = PROJECT_DIR + 'getnews/?m=topic&n=' + name + '&jn=' + jpname;
    $.get(query, function(data){
      var json = JsonParse(data);
      var attr = json['@attributes'];
      var ul;

      if(attr.mode == 'topic')
      {
        ul = CreateNewsMenu(data, '');
      }
      else
      {
        ul = document.createElement('div');
        div.innerHTML = '記事が取得できませんでした．';
      }
      //elem_news_list.appendChild(ul);
      all_news[attr.q2] = ul;
    });
  }
  //検索結果を表示しておく
  getNews('VTuber');
  //ログインメニュー
  all_news['LOGIN'] = createLoginPage();
  //ログアウト画面
  var logout = document.createElement('div');
  logout.classList.add('logout');
  logout.innerHTML = 'ログアウトしました';
  all_news['LOGOUT'] = logout;
  //VTuber選択画面
  all_news['SELECTVT'] = createSVTPage();
}

/*
 * VTuber選択ぺージを作る
 */
function createSVTPage(){
  var svt = document.createElement('div');
  var img_dir = document.getElementById('image-dir');

  for(var i = 0; i < VtuberList.length; i++)
  {
    var vtuber = VtuberList[i];
    var image = document.createElement('img');
    image.id = vtuber.name;
    image.src = img_dir.value + vtuber.image;
    image.classList.add('vtuber-image');
    image.addEventListener('click', ClickVTuberImage, false);
    svt.appendChild(image);
    svt.appendChild(document.createElement('br'));
  }

  return svt;
}

/*
 * VTuber画像のクリックイベント
 */
function ClickVTuberImage(){
  var target = event.target;
  user_data.setVTuber(target.id);
  //UpdatePageOnBaseUserData();
  document.cookie = 'vtuber=' + encodeURIComponent(target.id);
  location.reload();
}

/*
 * ログインページを作る
 */
function createLoginPage(){
  var login = document.createElement('div');
  login.classList.add(CSSCLASS.menu.login);
  login.innerHTML = '\
  <form id="login-form" class="login-form">\
    ユーザ名<input type="text" name="username" value=""><br>\
    パスワード<input type="password" name="password" value=""><br>\
    <button type="button" name="button" onclick="login()">ログイン</button><br>\
    <div id="login-message" class="login-message"></div>\
  </form>\
  <p class="signup-button">サインアップ</p>\
  <form id="signup-form" class="signup-form">\
    ユーザ名<input type="text" name="username" value=""><br>\
    パスワード<input type="password" name="password" value=""><br>\
    パスワード（確認）<input type="password" name="password2" value=""><br>\
    <button type="button" name="button" onclick="signup()">登録</button><br>\
    <div id="signup-message" class="signup-message"></div>\
  </form>\
  ';
  return login;
}

/*
 * ログインを試みる
 */
function login(){
  //フォームの読み込み
  var form = document.getElementById('login-form');
  var username = form.username.value;
  var password = form.password.value;
  user_data.Login(username, password);
}

/*
 * サインアップする（登録）
 */
function signup(){
  var form = document.getElementById('signup-form');
  var username = form.username.value;
  var password = form.password.value;
  var password2 = form.password2.value;
  if(username == "" || password == "")
  {
    document.getElementById('signup-message').innerHTML = 'ユーザ名またはパスワードを入力してください';
    return;
  }
  if(password != password2)
  {
    document.getElementById('signup-message').innerHTML = 'パスワードが違っています．';
    return;
  }
  user_data.Signup(username, password);
}

/*
 * ニュースを検索して，メニューを作成
 */
function getNews(key){
  key = encodeURIComponent(key);
  var query = PROJECT_DIR + 'getnews/?m=search&q=' + key;
  $.get(query, function(data){
  	//elem_news_list.appendChild(CreateNewsMenu(data, 'search'));
    all_news['SEARCH'] = CreateNewsMenu(data, '');
    elem_news_list.textContent = null;
    elem_news_list.appendChild(all_news['SEARCH']);
  });
}

/*
 * jsonデータからニュースメニューを作成する
 * dataはjsonテキスト
 * nameはトピック名（検索の場合はSEARCH）
 */
function CreateNewsMenu(data, name){
  //メニュー全体
  var menu = document.createElement('ul');
  //menu.id = name;

  var json = JsonParse(data);
  var items = json.channel.item;
  for(var i = 0; i < items.length; i++)
  {
    menu.appendChild(CreateNewsItem(items[i], name, i));
  }

  return menu;
}

/*
 * jsonデータから各ニュースの見出しを作成．
 */
function CreateNewsItem(data, name, id){
  //ニュース1つ分
  var item = document.createElement('li');
  //item.name = name;
  //item.id = name + '_' + id;
  item.classList.add(CSSCLASS.menu.newsItem);

  //ニュースの見出し
  item.innerHTML = data.title;

  //クリックされたときに使う情報
  var info = document.createElement('input');
  info.type = 'hidden';
  //info.name = name + '_info';
  info.value = JSON.stringify(data);

  //イベント設定
  item.addEventListener('click', ClickMenu, false);
  item.addEventListener('mouseover', MouseOverMenu, false);

  //要素の追加
  item.appendChild(info);

  return item;
}

/*
 * メニュークリック時のイベント
 */
function ClickMenu(){
  //イベント発生源取得(IEじゃできない？)Firefoxじゃできなかった
  var target = event.target;

  var info = target.firstElementChild;
  var data = JsonParse(info.value);
  UpdateNewsPage(data.link);
}

/*
 * メニューの上にマウスが乗ったとき
 */
function MouseOverMenu(){
  var target = event.target;

  var info = target.firstElementChild;


}

/*
 * リンクを受け取ってコンテンツゾーンを更新
 */
function UpdateNewsPage(url){
  document.getElementById('contents_iframe').contentWindow.location.replace(url);
  $('body').removeClass('side-open');
  $('#free2').animate({'right':'0px'}, 500);
  document.cookie = 'url=' + encodeURIComponent(url);
}

/*
 * ウィンドウのサイズ変更時の処理
 */
function windowresize(){
  var iframe = document.getElementById('contents_iframe');
  iframe.width = window.innerWidth;
  iframe.height = window.innerHeight;
}

/*
 * user_dataを基にページを更新
 */
function UpdatePageOnBaseUserData(){
  //UpdateFavoriteList(user_data.favorite);
  //モデルが変わっているとき
  var modelname = document.getElementById('model-name');
  if(modelname.value != user_data.vtuber.name)
  {
    modelname.value = user_data.vtuber.name;
    ModelLoad();
  }
}

/*
 * お気に入りリストを更新
 */
function UpdateFavoriteList(f_list){
  elem_favorite_list.innerHTML = '';
  for(var i = 0; i < f_list.length; i++)
  {
    var topic = SearchTopicFromTOPICS(f_list[i]);
    if(topic == null)
    {
      continue;
    }
    var elem = CreateMenuElement(topic);
    elem_favorite_list.appendChild(elem);
    elem_favorite_list.appendChild(document.createElement('br'));
  }
}

/*
 * トピックの情報を返す．
 */
function SearchTopicFromTOPICS(topic){
  for(var i = 0; i < TOPICS.length; i++)
  {
    if(TOPICS[i].name == topic){
      return TOPICS[i];
    }
  }
  return null;
}

/*
 * お気に入り登録
 */
function RegistFavorite(topic){
  user_data.addFavorite(topic);
  UpdatePageOnBaseUserData();
}

/*
 * お気に入り削除
 */
function RemoveFavorite(topic){
  user_data.removeFavorite(topic);
  UpdatePageOnBaseUserData();
}
