var scene, camera, clock, loader, renderer;
var hem_light, point_light; 
var panda; 
var toon, toon_name, toon_guild;
var mixers = []; 

function init() { 
  container = document.getElementById('container');

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);
  clock = new THREE.Clock();
  loader = new THREE.JSONLoader(); 
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  toon = document.getElementById("toon");
  toon_name = document.getElementById("toon-name");
  toon_guild = document.getElementById("toon-guild");
  resizeWindow();

  setup();
}

function setup() { 
  camera.rotation.x -= Math.PI/9.25;
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
  toon_name.style.fontSize = 19*window.innerHeight/1000.;
  toon_guild.style.fontSize = 17*window.innerHeight/1000.;

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
  var geometry = new THREE.CircleGeometry(18, 12);
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
  loader.load("models/jsons/panda_walk3.json", function (geometry, materials) { 
    skinMats(materials);
    panda = new THREE.SkinnedMesh(geometry, materials);

    panda.scale.set(.8, .8, .8);
    // panda.position.set(0,0,0);
    panda.rotation.set(0,Math.PI/3.2,0)
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

window.onload = () => {
  document.querySelector("body").style.opacity = 1;
}

init(); 

createLights();
createFloor();
createPanda();

animate();