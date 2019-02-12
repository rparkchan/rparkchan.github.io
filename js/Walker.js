var scene, camera, clock, loader, renderer;
var hem_light, point_light; 
var panda; 
var mixers; 

function init(){ 
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 10000 );
  clock = new THREE.Clock();
  loader = new THREE.JSONLoader(); 
  renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );

  container = document.getElementById( 'container' );

  mixers = [];

  setup();
}

function setup() { 
  camera.rotation.x += -Math.PI/10 
  camera.position.set(0, 50, 100)

  clock.start();

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  container.appendChild(renderer.domElement);
}

function createLights() { 
  hem_light = new THREE.HemisphereLight(0xffffff, 0x222222, .8); 
  scene.add(hem_light);

  point_light = new THREE.PointLight(0xffffff, .4, 1000, 2);
  point_light.castShadow = true;
  point_light.position.set(10, 20, 10);
  scene.add(point_light);
}

function createPanda() {
  loader.load("models/jsons/panda_walk.json", function (geometry, materials) { 
    skinMats(materials);
    panda = new THREE.SkinnedMesh( geometry, materials );

    console.log(materials);

    panda.scale.set(.6, .6, .6);
    panda.position.set(0,0,0);
    panda.rotation.set(0,Math.PI/3,0)
    panda.castShadow = true;

    createSkeletalMixer( panda, mixers, 'walk' );
    scene.add( panda );
  });
}

function createFloor() {
  var geometry = new THREE.CircleGeometry( 14, 12 );
  var material = new THREE.MeshStandardMaterial({
    color: 0xffffff, 
    metalness: 0.25, 
    side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh(geometry, material);
  plane.rotation.set(Math.PI/2, 0, 0);
  plane.receiveShadow = true;
  scene.add(plane);
}

function animate() { 
  requestAnimationFrame( animate );

  delta_time = clock.getDelta();
  mixers.forEach(function (mixer) {
    mixer.update(delta_time);
  });

  renderer.render(scene, camera);
}

init(); 

createLights();
createFloor();
createPanda();

animate();