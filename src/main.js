
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';

// 1. Krijimi i skenës
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe6ded3);

// 2. Krijimi i kamerës
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(5.5, 5, 7);
camera.lookAt(0, 1, 0);

// 3. Krijimi i renderer-it
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const container = document.querySelector('#app');
container.appendChild(renderer.domElement);

// 4. Ndriçimi ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
scene.add(ambientLight);

// 5. Ndriçimi natyral
const sunlight = new THREE.DirectionalLight(0xffedda, 3);
sunlight.position.set(5, 9, 5);
sunlight.castShadow = true;
sunlight.shadow.mapSize.width = 2048;
sunlight.shadow.mapSize.height = 2048;
sunlight.shadow.camera.left = -8;
sunlight.shadow.camera.right = 8;
sunlight.shadow.camera.top = 8;
sunlight.shadow.camera.bottom = -8;
sunlight.shadow.bias = -0.0002;
scene.add(sunlight);

// 6. Krijimi i dyshemesë
const floorGeometry = new THREE.PlaneGeometry(9, 9);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xc8ad8e,
  roughness: 0.75,
  metalness: 0
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// 7. Materiali i mureve
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xf3eadf,
  roughness: 0.9
});

// 8. Muri i pasmë
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(9, 5, 0.2),
  wallMaterial
);
backWall.position.set(0, 2.5, -4.5);
backWall.receiveShadow = true;
scene.add(backWall);

// 9. Muri anësor
const sideWall = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 5, 9),
  wallMaterial
);
sideWall.position.set(-4.5, 2.5, 0);
sideWall.receiveShadow = true;
scene.add(sideWall);

// 10. GLTFLoader
const loader = new GLTFLoader();

// 11. Ngarkimi i tavolinës
loader.load(
  '/models/table/polyhaven-wooden-table-02.glb',
  (gltf) => {
    const table = gltf.scene;
    table.scale.set(1, 1, 1);
    table.position.set(0, 0, 0);

    table.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(table);
    console.log('Tavolina u ngarkua me sukses!');
  },
  undefined,
  (error) => console.error('Gabim gjatë ngarkimit të tavolinës:', error)
);

// 12. Pozicionet e katër karrigeve
const chairPositions = [
  [0, 0, 2.2],
  [0, 0, -2.2],
  [2.2, 0, 0],
  [-2.2, 0, 0]
];

const MODEL_FRONT_OFFSET = 0;

// 13. Ngarkimi i karrigeve
chairPositions.forEach((position) => {
  loader.load(
    '/models/chair/dining_chair_02_2k.gltf',
    (gltf) => {
      const chair = gltf.scene;

      chair.scale.set(0.80, 0.80, 0.80);
      chair.position.set(...position);

      const angle = Math.atan2(-position[0], -position[2]);
      chair.rotation.y = angle + MODEL_FRONT_OFFSET;

      chair.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(chair);
    },
    undefined,
    (error) => console.error('Gabim gjatë ngarkimit të karriges:', error)
  );
});

// 14. Animimi dhe renderimi
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// 15. Përshtatja me madhësinë e ekranit
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
