var container, stats;
var mesh, camera, scene, renderer, effect, ambient, directionalLight;
var composer, clearPass;
var helper, ikHelper, physicsHelper;
var clock = new THREE.Clock();

var elem_vtuber_viewer = document.getElementById('vtuber-viewer');
var elem_models_dir = document.getElementById('models-dir');
var elem_motions_dir = document.getElementById('motions-dir');
var elem_model_name = document.getElementById('model-name');
var elem_image_dir = document.getElementById('image-dir');

var vmds = [];

//var additionalFunc = null;

/*
var todayButton = document.getElementById('today');
var tommorowButton = document.getElementById('tommorow');
var aftertommorowButton = document.getElementById('aftertommorow');
var uranaiButton = document.getElementById('uranai');
*/
var telop = document.getElementById('telop');
var scrollP = document.getElementById('scroll-p');

//1emが何pxか調べる．
const EMSCALE = function(){
  var emscale = document.getElementById('emScale');
  return emscale.clientHeight;
};

//var forecasts;

//loadForecasts();
init();
ModelLoad();
animate();

/*
function loadForecasts(){
  var elem = document.getElementById("json-data");
  forecasts = JSON.parse(elem.textContent);
  console.log(forecasts);
  //天気が格納されていない場合がある．
  todayButton.disabled = true;
  tommorowButton.disabled = true;
  aftertommorowButton.disabled = true;
  for(var i = 0; i < forecasts['forecasts'].length; i++)
  {
    if(forecasts['forecasts'][i]['dateLabel'] == '今日')
    {
      todayButton.disabled = false;
    }
    else if(forecasts['forecasts'][i]['dateLabel'] == '明日')
    {
      tommorowButton.disabled = false;
    }
    else if(forecasts['forecasts'][i]['dateLabel'] == '明後日')
    {
      aftertommorowButton.disabled = false;
    }
  }
}
*/

function init() {
  //初期化処理
  var height = elem_vtuber_viewer.clientHeight;
  var width = elem_vtuber_viewer.clientWidth;
  container = document.createElement( 'div' );
  elem_vtuber_viewer.appendChild( container );
  camera = new THREE.PerspectiveCamera( 45, width / height, 1, 2000 );
  camera.position.set(0, 4, 15);
  camera.up.set(0, 1, 0);
  camera.lookAt(new THREE.Vector3(0, 4, 0));
  //controls = new THREE.OrbitControls(camera);
  // scene
  scene = new THREE.Scene();
  scene.background = [new THREE.Color( 0xe0f8f7 ), 0];
  //scene.background.setClearAlpha(0);
  //床
  /*
  var gridHelper = new THREE.PolarGridHelper( 30, 10 );
  gridHelper.position.y = - 10;
  scene.add( gridHelper );
  */
  //環境光
  //ambient = new THREE.AmbientLight( user_data.vtuber.light );
  //scene.add( ambient );
  //方向光
  directionalLight = new THREE.DirectionalLight( 0x887766 );
  directionalLight.position.set( - 1, 1, 1 ).normalize();
  scene.add( directionalLight );

  //レンダラー
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( width, height );
  renderer.setClearColor(0xeeeeee, 0);
  container.appendChild( renderer.domElement );
  effect = new THREE.OutlineEffect( renderer );
  // STATS
  /*
  stats = new Stats();
  container.appendChild( stats.dom );
  */
  //ラインエフェクトを切る
  effect.enabled = false;

  //マウスコントローラを切る
  /*
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.dispose();
  */

  window.addEventListener( 'resize', onWindowResize, false );
}

function ModelLoad() {
  //以前のデータを開放する
  if(scene)
  {
    scene.remove(mesh);
  }
  if(mesh)
  {
    //console.log(mesh);
    mesh = null;
    //mesh.material.dispose();
    //mesh.geometry.dispose();
  }
  //console.log(helper);
  if(helper)
  {
    delete helper;
  }
  //ヘルパーの作成
  helper = new THREE.MMDAnimationHelper( {
    afterglow: 2.0
  } );

  // 読み込み時の処理
  function onProgress( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  }
  function onError (xhr) {
    console.log('load mmd error');
  };

  var modelFile = elem_models_dir.value + elem_model_name.value;
  console.log(modelFile);

  var vmdFiles = [
    {name : 'idle', file : elem_motions_dir.value + 'pose1.vmd'}
  ];

  scene.remove(ambient);

  //環境光
  ambient = new THREE.AmbientLight( user_data.vtuber.light );
  scene.add( ambient );

  //モデルのロード
  var loader = new THREE.MMDLoader();
  loader.load(modelFile, function(mmd){
    //モーションの読み込み
    if(vmdFiles && vmdFiles.length !== 0) {
      var vmdIndex = 0;

      //モーションを１つ読む
      function loadVmd(){
        var vmdFile = vmdFiles[vmdIndex].file;
        vmdIndex++;
        loader.loadAnimation(vmdFile, mmd, function(animation){
          vmds.push(animation);
          if (vmdIndex < vmdFiles.length) {
            //再帰的に実行
            loadVmd();
          } else {
            mesh = mmd;
            mmd = animation;
            //位置を調整
            mesh.position.y = user_data.vtuber.position_y;
            //シーンにモデルを加える
            scene.add( mesh );


            //ヘルパーにモデルを登録する
            helper.add( mesh, {
              animation: mmd.animation,
              physics: true
            } );
            /*
            //ikのボーン表示を設定する
            ikHelper = helper.objects.get( mesh ).ikSolver.createHelper();
            ikHelper.visible = false;
            scene.add( ikHelper );

            //物理演算のメッシュ表示を設定する
            physicsHelper = helper.objects.get( mesh ).physics.createHelper();
            physicsHelper.visible = false;
            scene.add( physicsHelper );
            */
            //console.log(mesh);
            setAnimation(0);
          }
        }, onProgress, onError);
      };
      loadVmd();
    }
  }, onProgress, onError);

  //マテリアルを適応
  var phongMaterials;
  var originalMaterials;
  function makePhongMaterials( materials ) {
    var array = [];
    for ( var i = 0, il = materials.length; i < il; i ++ ) {
      var m = new THREE.MeshPhongMaterial({map:transparent_map, transparent:true});
      m.copy( materials[ i ] );
      m.needsUpdate = true;
      array.push( m );
    }
    phongMaterials = array;
  }
}

function onWindowResize() {
  var height = elem_vtuber_viewer.clientHeight;
  var width = elem_vtuber_viewer.clientWidth;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  effect.setSize( width, height );
}
//
function animate() {
  requestAnimationFrame( animate );
  //if(additionalFunc) additionalFunc();
  //stats.begin();
  render();
  //stats.end();
}
function render() {
  helper.update( clock.getDelta() );
  effect.render( scene, camera );
}

function setAnimation(index) {
  if(index === -1) {
    mesh.mixer.stopAllAction();
  } else {
    var objects = helper.objects.get(mesh);
    objects.mixer = new THREE.AnimationMixer(mesh);
    objects.mixer.clipAction(vmds[index]).play();
  }
}

//天気に従ってメッセージをいう
/*
var resetPoseID;
function sayForecast(forecast) {
  if(resetPoseID)
  {
    clearInterval(resetPoseID);
    resetPoseID = null;
  }

  telop.style.opacity = '1.0';
  var min = (forecast['temperature']['min']) ? forecast['temperature']['min']['celsius'] : '--';
  var max = (forecast['temperature']['max']) ? forecast['temperature']['max']['celsius'] : '--';
  //telop.style.display = 'block';
  var telopMsg = '';
  telopMsg += forecast['dateLabel'] + "の天気 ";
  telopMsg += forecasts['location']['prefecture'] + " ";
  telopMsg += forecast['telop'] + " ";
  telopMsg += '(最高:' + max + '℃/最低' + min + '℃) ';
  scrollP.innerHTML = telopMsg;

  var forecastNum = Number(forecast['image']['url'].match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1]) - 1;
  sayActions = [
    {time:0.0, interval:1.0, message:forecast['dateLabel'] + 'の天気は～？'},
    {time:1.5, interval:2.0, message:forecast['telop'] + '！！'},
    {time:2.5, interval:5.2, message:HITOKOTO[forecastNum]},
  ];
  setAnimation(1);
  showSomeMessages(sayActions);
  resetPoseID = setTimeout(function(){
    setAnimation(0);
  }, 8900);
}

//吹き出しの処理
var fukidashi = document.getElementById('fukidashi');
var fkidashiMsg = document.getElementById('fukidashiMessage');
var deviation = {x:0, y:0}; //偏差（px）
var ids = [];
var startTimerId = null;
var finishTimerId = null;
function showSomeMessages(sayActions)
{
  if(ids.length != 0)
  {
    ids.forEach(function(value){
      clearInterval(value);
    });
    ids = [];
    hiddenMessageBox();
  }

  sumTime = 0;
  var say = function(action){
      console.log(action);
      showMessage(0, action.interval, action.message);
  }
  for(var i = 0; i < sayActions.length; i++)
  {
    sumTime += sayActions[i].time;
    //console.log(sumTime);
    //ids.push(setTimeout(function(){say(sayActions[i])}, sumTime));
    ids.push(setTimeout(function(action){
        showMessage(0, action.interval, action.message);
    }, sumTime * 1000, sayActions[i]));
  }
}

//time秒後にmessageをポン子がinterval間，発言する
function showMessage(time, interval, message)
{
  if(time === 'undefined') time = 0;
  if(interval === 'undefined') interval = 1;
  if(message === 'undefined') message = 'default message';
  //console.log(time, interval, message);

  if(startTimerId)
  {
    clearInterval(startTimerId);
    clearInterval(finishTimerId);
    hiddenMessageBox();
    startTimerId = null;
    finishTimerId = null;
  }

  startTimerId = setTimeout(function () {
    deviation.x = -EMSCALE() * message.length * 2;
    deviation.y = -100;
    console.log(deviation);
    showMessageBox(message);
    finishTimerId = setTimeout(function() {
      hiddenMessageBox();
    }, interval * 1000);
  }, time * 1000);
}

//メッセージボックスを表示する
function showMessageBox(message)
{
  //console.log('show!');
  additionalFunc = moveMessageBox;
  fukidashi.style.display = 'block';
  fukidashiMessage.innerHTML = message;
}

//メッセージボックスを隠す
function hiddenMessageBox()
{
  //console.log('hidden');
  additionalFunc = null;
  fukidashi.style.display = 'none';
}

//メッセージボックスを動かし続ける．
function moveMessageBox()
{
  //console.log('move');
  //console.log(mesh.skeleton.bones[131]);
  //object3D = new THREE.Mesh();
  var matrixWorld = mesh.skeleton.bones[131].matrixWorld.elements;
  //console.log(matrixWorld);
  var screenV = new THREE.Vector3(matrixWorld[12], matrixWorld[13], matrixWorld[14]);
  //console.log(screenV);
  screenV.copy(screenV);
  screenV.project(camera);
  //var project = screenV.project(camera);
  var halfwidth = window.innerWidth / 2;
  var halfheight = document.getElementById('viewer').clientHeight / 2;
  var screenX = screenV.x * halfwidth + halfwidth;
  var screenY = -screenV.y * halfheight + halfheight;
  var x = Math.round(screenX) + deviation.x;
  var y = Math.round(screenY) + deviation.y;
  //console.log(screenX, screenY);
  fukidashi.style.transform = "translate(" + x + "px, " + y + "px)";
}

todayButton.addEventListener('click', function(){
  console.log('today');

  sayForecast(forecasts['forecasts'][0]);
});

tommorowButton.addEventListener('click', function(){
  console.log('tommorow');
  sayForecast(forecasts['forecasts'][1]);
});

aftertommorowButton.addEventListener('click', function(){
  console.log('aftertommorow');
  sayForecast(forecasts['forecasts'][2]);
});

uranaiButton.addEventListener('click', function(){
  console.log('uranai');
  if(resetPoseID)
  {
    clearInterval(resetPoseID);
    resetPoseID = null;
  }
  if(ids.length != 0)
  {
    ids.forEach(function(value){
      clearInterval(value);
    });
    ids = [];
    hiddenMessageBox();
  }
  showMessage(0, 3, '猫耳ダンスを踊るよ！');
  telop.style.opacity = '0.0';
  setAnimation(2);
});
*/
