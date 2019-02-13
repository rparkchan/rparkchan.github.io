var scene, camera, clock, loader, renderer;
var hem_light, point_light; 
var panda; 
var mixers = []; 

function init() { 
  container = document.getElementById('container');

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);
  clock = new THREE.Clock();
  loader = new THREE.JSONLoader(); 
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  resizeWindow();

  setup();
}

function setup() { 
  camera.rotation.x -= Math.PI/10;
  camera.position.set(0, 50, 100);
  window.addEventListener('resize', resizeWindow, false);

  clock.start();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  container.appendChild(renderer.domElement);
}

function resizeWindow() {
  document.getElementById("toon-name").style.fontSize = 17.5*window.innerHeight/1000.;
  document.getElementById("toon-guild").style.fontSize = 15.5*window.innerHeight/1000.;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

function createLights() { 
  hem_light = new THREE.HemisphereLight(0xffffff, 0x222222, .8); 
  scene.add(hem_light);

  point_light = new THREE.PointLight(0xffffff, .4, 1000, 2);
  point_light.castShadow = true;
  point_light.position.set(10, 20, 10);
  scene.add(point_light);
}

function createFloor() {
  var geometry = new THREE.CircleGeometry(14, 12);
  var material = new THREE.MeshStandardMaterial({
    color: 0xffffff, 
    metalness: 0.15, 
    side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh(geometry, material);
  plane.rotation.set(Math.PI/2, 0, 0);
  plane.receiveShadow = true;
  scene.add(plane);
}

function createPanda() {
  loader.load("models/jsons/panda_walk2.json", function (geometry, materials) { 
    skinMats(materials);
    panda = new THREE.SkinnedMesh(geometry, materials);

    panda.scale.set(.6, .6, .6);
    panda.position.set(0,0,0);
    panda.rotation.set(0,Math.PI/3,0)
    panda.castShadow = true;

    createSkeletalMixer(panda, mixers, 'walk');
    scene.add(panda);
  });
}

function animate() { 
  requestAnimationFrame(animate);
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