
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';

// 1. Krijimi i skenës
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8e0d6);

// 2. Krijimi i kamerës
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(3.8, 3.2, 4.6);
camera.lookAt(0, 1.1, 0);

// 3. Krijimi i renderer-it
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const container = document.querySelector('#app');
container.appendChild(renderer.domElement);

// 4. Ndriçimi ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(ambientLight);

// 5. Ndriçimi natyral
const sunlight = new THREE.DirectionalLight(0xffe6c7, 1.8);
sunlight.position.set(5, 8, 5);
sunlight.castShadow = true;

sunlight.shadow.mapSize.width = 2048;
sunlight.shadow.mapSize.height = 2048;
sunlight.shadow.camera.left = -7;
sunlight.shadow.camera.right = 7;
sunlight.shadow.camera.top = 7;
sunlight.shadow.camera.bottom = -7;
sunlight.shadow.bias = -0.0002;

scene.add(sunlight);

// 6. Ndriçimi plotësues
const hemisphereLight = new THREE.HemisphereLight(
  0xfff4e5,
  0x8b7765,
  0.4
);
scene.add(hemisphereLight);

// 7. Dyshemeja
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    color: 0xc8ad8e,
    roughness: 0.85,
    metalness: 0
  })
);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// 8. Tapeti
const rugBorder = new THREE.Mesh(
  new THREE.PlaneGeometry(5.2, 5.2),
  new THREE.MeshStandardMaterial({
    color: 0x9b8068,
    roughness: 1
  })
);

rugBorder.rotation.x = -Math.PI / 2;
rugBorder.position.y = 0.015;
rugBorder.receiveShadow = true;
scene.add(rugBorder);

const rug = new THREE.Mesh(
  new THREE.PlaneGeometry(5.0, 5.0),
  new THREE.MeshStandardMaterial({
    color: 0xd8c7b3,
    roughness: 1
  })
);

rug.rotation.x = -Math.PI / 2;
rug.position.y = 0.02;
rug.receiveShadow = true;
scene.add(rug);

// 9. Materiali i mureve
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xf3eadf,
  roughness: 0.9
});

// 10. Muri i pasmë me hapësirë për ballkonin

// Pjesa e majtë e murit
const backWallLeft = new THREE.Mesh(
  new THREE.BoxGeometry(2.1, 5, 0.2),
  wallMaterial
);

backWallLeft.position.set(-2.95, 2.5, -4);
backWallLeft.receiveShadow = true;
scene.add(backWallLeft);

// Pjesa e djathtë e murit
const backWallRight = new THREE.Mesh(
  new THREE.BoxGeometry(2.1, 5, 0.2),
  wallMaterial
);

backWallRight.position.set(2.95, 2.5, -4);
backWallRight.receiveShadow = true;
scene.add(backWallRight);

// Pjesa e sipërme e murit
const backWallTop = new THREE.Mesh(
  new THREE.BoxGeometry(3.8, 1.5, 0.2),
  wallMaterial
);

backWallTop.position.set(0, 4.25, -4);
backWallTop.receiveShadow = true;
scene.add(backWallTop);

// Pjesa e poshtme e murit
const backWallBottom = new THREE.Mesh(
  new THREE.BoxGeometry(3.8, 0.5, 0.2),
  wallMaterial
);

backWallBottom.position.set(0, 0.25, -4);
backWallBottom.receiveShadow = true;
scene.add(backWallBottom);

// 11. Muri i majtë
const sideWall = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 5, 8),
  wallMaterial
);

sideWall.position.set(-4, 2.5, 0);
sideWall.receiveShadow = true;
scene.add(sideWall);

// 12. Dera panoramike prej xhami

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xdceaf0,
  transparent: true,
  opacity: 0.28,
  roughness: 0.12,
  metalness: 0,
  side: THREE.DoubleSide
});

// Xhami i derës
const glass = new THREE.Mesh(
  new THREE.PlaneGeometry(3.65, 2.85),
  glassMaterial
);

glass.position.set(0, 2, -3.88);
scene.add(glass);

// Kornizat e zeza metalike
const frameMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  metalness: 0.7,
  roughness: 0.3
});

// Kornizat vertikale
[-1.85, 0, 1.85].forEach((x) => {
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.055, 2.95, 0.09),
    frameMaterial
  );

  frame.position.set(x, 2, -3.77);
  frame.castShadow = true;
  scene.add(frame);
});

// Kornizat horizontale
[0.53, 3.47].forEach((y) => {
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(3.75, 0.055, 0.09),
    frameMaterial
  );

  frame.position.set(0, y, -3.77);
  scene.add(frame);
});

// 13. Ballkoni

// Dyshemeja e ballkonit
const balconyFloor = new THREE.Mesh(
  new THREE.BoxGeometry(4.2, 0.15, 1.8),
  new THREE.MeshStandardMaterial({
    color: 0xb9aa98,
    roughness: 0.8
  })
);

balconyFloor.position.set(0, 0.05, -4.9);
balconyFloor.receiveShadow = true;
scene.add(balconyFloor);

// Materiali i parmakëve
const railingMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  metalness: 0.75,
  roughness: 0.25
});

// Parmaku i sipërm
const railingTop = new THREE.Mesh(
  new THREE.BoxGeometry(4.2, 0.07, 0.07),
  railingMaterial
);

railingTop.position.set(0, 1.05, -5.75);
scene.add(railingTop);

// Parmaku i poshtëm
const railingBottom = new THREE.Mesh(
  new THREE.BoxGeometry(4.2, 0.05, 0.05),
  railingMaterial
);

railingBottom.position.set(0, 0.12, -5.75);
scene.add(railingBottom);

// Shtyllat vertikale
for (let i = 0; i <= 12; i++) {
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 1, 0.035),
    railingMaterial
  );

  post.position.set(
    -2.05 + i * (4.1 / 12),
    0.55,
    -5.75
  );

  scene.add(post);
}

// 14. Perdet bezhë

const curtainMaterial = new THREE.MeshStandardMaterial({
  color: 0xe5d5c2,
  roughness: 1,
  side: THREE.DoubleSide
});

// Shufra e perdeve
const curtainRod = new THREE.Mesh(
  new THREE.CylinderGeometry(0.035, 0.035, 4.1, 16),
  frameMaterial
);

curtainRod.rotation.z = Math.PI / 2;
curtainRod.position.set(0, 3.58, -3.65);
scene.add(curtainRod);

// Perdet në të dy anët
[-1.65, 1.65].forEach((side) => {
  for (let i = 0; i < 6; i++) {
    const fold = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 2.75, 0.07),
      curtainMaterial
    );

    fold.position.set(
      side + (side < 0 ? i * 0.105 : -i * 0.105),
      2,
      -3.65
    );

    fold.castShadow = true;
    fold.receiveShadow = true;
    scene.add(fold);
  }
});

// 15. GLTFLoader
const loader = new GLTFLoader();

// 16. Ngarkimi i tavolinës
loader.load(
  '/models/table/polyhaven-wooden-table-02.glb',
  (gltf) => {
    const table = gltf.scene;

    table.scale.set(2, 1, 2);
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

// 17. Pozicionet e katër karrigeve
const chairPositions = [
  [0, 0, 1.65],
  [0, 0, -1.65],
  [1.75, 0, 0],
  [-1.75, 0, 0]
];

const MODEL_FRONT_OFFSET = 0;

// Ngarkimi i karrigeve
chairPositions.forEach((position) => {
  loader.load(
    '/models/chair/dining_chair_02_2k.gltf',
    (gltf) => {
      const chair = gltf.scene;

      chair.scale.set(2.50, 1, 2.50);
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

// 18. Pozicionet e katër llambave
const lampPositions = [
  // Dy llamba në murin e pasmë
  { x: -2.2, y: 2.8, z: -3.87, rotation: 0 },
  { x:  2.2, y: 2.8, z: -3.87, rotation: 0 },

  // Dy llamba në murin e majtë
  { x: -3.87, y: 2.8, z: -2.2, rotation: Math.PI / 2 },
  { x: -3.87, y: 2.8, z:  2.2, rotation: Math.PI / 2 }
];

// 19. Ngarkimi i modelit të llambës
loader.load(
  '/models/lamp/wall_lamp.gltf/industrial_wall_sconce_2k.gltf',

  (gltf) => {
    console.log('Modeli i llambës u ngarkua me sukses!');

    const originalLamp = gltf.scene;

    originalLamp.updateMatrixWorld(true);

    const originalBox = new THREE.Box3().setFromObject(originalLamp);
    const originalSize = originalBox.getSize(new THREE.Vector3());
    const originalCenter = originalBox.getCenter(new THREE.Vector3());

    console.log('Madhësia e llambës:', originalSize);

    const targetHeight = 0.65;
    const scaleFactor = targetHeight / Math.max(originalSize.y, 0.001);

    lampPositions.forEach((position, index) => {
      const lamp = originalLamp.clone(true);

      lamp.position.set(
        -originalCenter.x * scaleFactor,
        -originalCenter.y * scaleFactor,
        -originalCenter.z * scaleFactor
      );

      lamp.scale.setScalar(scaleFactor);

      const lampGroup = new THREE.Group();
      lampGroup.add(lamp);

      lampGroup.position.set(
        position.x,
        position.y,
        position.z
      );

      lampGroup.rotation.y = position.rotation;

      lamp.traverse((child) => {
        if (child.isMesh) {
          child.visible = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(lampGroup);

      const wallLight = new THREE.PointLight(
        0xffd6a1,
        5,
        4,
        2
      );

      wallLight.position.set(
        position.x + (position.x === -3.87 ? 0.45 : 0),
        position.y,
        position.z + (position.z === -3.87 ? 0.45 : 0)
      );

      scene.add(wallLight);

      console.log(`Llamba ${index + 1} u vendos në skenë.`);
    });
  },

  (progress) => {
    console.log('Duke ngarkuar modelin e llambës:', progress);
  },

  (error) => {
    console.error('Gabim gjatë ngarkimit të llambës:', error);
  }
);

// 20. Animimi dhe renderimi
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// 20. KOMODINA MODERNE

const cabinetWood = new THREE.MeshStandardMaterial({
  color: 0x805b40,
  roughness: 0.65
});

const cabinetDark = new THREE.MeshStandardMaterial({
  color: 0x30251e,
  roughness: 0.5
});

const cabinetTop = new THREE.MeshStandardMaterial({
  color: 0xa47b59,
  roughness: 0.4
});

// Trupi i komodinës
const cabinetBody = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.8, 2.0),
  cabinetWood
);

cabinetBody.position.set(-3.43, 0.85, 0);
cabinetBody.castShadow = true;
cabinetBody.receiveShadow = true;
scene.add(cabinetBody);

// Pjesa e sipërme
const cabinetSurface = new THREE.Mesh(
  new THREE.BoxGeometry(0.85, 0.09, 2.1),
  cabinetTop
);

cabinetSurface.position.set(-3.43, 1.295, 0);
cabinetSurface.castShadow = true;
scene.add(cabinetSurface);

// Këmbët e komodinës
for (let z of [-0.82, 0.82]) {
  for (let x of [-3.7, -3.16]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.35, 0.06),
      cabinetDark
    );

    leg.position.set(x, 0.35, z);
    scene.add(leg);
  }
}

// Dyert e komodinës
for (let z of [-0.5, 0.5]) {
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.65, 0.9),
    cabinetTop
  );

  door.position.set(-3.035, 0.85, z);
  scene.add(door);

  // Dorezat metalike
  const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xc6a56a,
      metalness: 0.8,
      roughness: 0.25
    })
  );

  handle.position.set(-2.99, 0.85, z);
  scene.add(handle);
}

// 21. PIKTURA ABSTRAKTE NË MUR

const paintingFrameMaterial = new THREE.MeshStandardMaterial({
  color: 0x30251e,
  roughness: 0.45
});

const paintingFrame = new THREE.Mesh(
  new THREE.BoxGeometry(0.09, 1.2, 1.75),
  paintingFrameMaterial
);

paintingFrame.position.set(-3.82, 2.35, 0);
scene.add(paintingFrame);

// Pjesa e brendshme e pikturës
const paintingCanvas = new THREE.Mesh(
  new THREE.PlaneGeometry(1.65, 1.1),
  new THREE.MeshStandardMaterial({
    color: 0xd9c6ad,
    roughness: 1,
    side: THREE.DoubleSide
  })
);

paintingCanvas.rotation.y = Math.PI / 2;
paintingCanvas.position.set(-3.765, 2.35, 0);
scene.add(paintingCanvas);

// Forma dekorative në pikturë
const artMaterial1 = new THREE.MeshStandardMaterial({
  color: 0x9b775b,
  roughness: 1
});

const artMaterial2 = new THREE.MeshStandardMaterial({
  color: 0xeee0ce,
  roughness: 1
});

const artShape1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.35, 24, 24),
  artMaterial1
);

artShape1.scale.set(0.12, 1.1, 1);
artShape1.rotation.z = 0.45;
artShape1.position.set(-3.74, 2.35, -0.35);
scene.add(artShape1);

const artShape2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 24, 24),
  artMaterial2
);

artShape2.scale.set(0.12, 0.75, 1.2);
artShape2.rotation.z = -0.5;
artShape2.position.set(-3.73, 2.35, 0.4);
scene.add(artShape2);

// 22. BIMË DEKORATIVE PRANË BALLKONIT

const plantPotMaterial = new THREE.MeshStandardMaterial({
  color: 0xc8b49d,
  roughness: 0.8
});

const plantPot = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.18, 0.55, 32),
  plantPotMaterial
);

plantPot.position.set(2.8, 0.3, -3.0);
plantPot.castShadow = true;
plantPot.receiveShadow = true;
scene.add(plantPot);

// Dheu në vazo
const soil = new THREE.Mesh(
  new THREE.CircleGeometry(0.22, 32),
  new THREE.MeshStandardMaterial({
    color: 0x493323
  })
);

soil.rotation.x = -Math.PI / 2;
soil.position.set(2.8, 0.58, -3.0);
scene.add(soil);

// Trungu i bimës
const trunk = new THREE.Mesh(
  new THREE.CylinderGeometry(0.035, 0.06, 1.5, 12),
  new THREE.MeshStandardMaterial({
    color: 0x715039
  })
);

trunk.position.set(2.8, 1.3, -3.0);
scene.add(trunk);

// Gjethet
const leafMaterial = new THREE.MeshStandardMaterial({
  color: 0x526d45,
  roughness: 0.8
});

const leafPositions = [
  [2.35, 1.8, -3.0],
  [3.25, 1.9, -3.0],
  [2.8, 2.25, -3.0],
  [2.55, 2.0, -3.35],
  [3.05, 2.05, -2.65],
  [2.3, 2.2, -2.8],
  [3.3, 2.25, -3.2],
  [2.8, 2.55, -2.9]
];

leafPositions.forEach((position, index) => {
  const leaf = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 16, 16),
    leafMaterial
  );

  leaf.scale.set(0.45, 1.0, 0.25);
  leaf.rotation.z = (index % 2 === 0 ? 0.6 : -0.6);
  leaf.position.set(...position);

  leaf.castShadow = true;
  scene.add(leaf);
});


 // 23. DEKORIMI I KOMODINËS

// Materialet
const decorGold = new THREE.MeshStandardMaterial({
  color: 0xb99a63,
  metalness: 0.75,
  roughness: 0.3
});

const decorCream = new THREE.MeshStandardMaterial({
  color: 0xe6d8c5,
  roughness: 0.45
});

const decorDark = new THREE.MeshStandardMaterial({
  color: 0x594331,
  roughness: 0.5
});

// Vazo dekorative
const decorVase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.13, 0.18, 0.42, 32),
  decorCream
);

decorVase.position.set(-3.35, 1.55, -0.55);
decorVase.castShadow = true;
scene.add(decorVase);

// Qafa e vazos
const decorVaseNeck = new THREE.Mesh(
  new THREE.CylinderGeometry(0.09, 0.13, 0.16, 32),
  decorCream
);

decorVaseNeck.position.set(-3.35, 1.84, -0.55);
scene.add(decorVaseNeck);

// Degë dekorative në vazo
const branchMaterial = new THREE.MeshStandardMaterial({
  color: 0x687653,
  roughness: 0.8
});

for (let i = 0; i < 3; i++) {
  const branch = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.018, 0.65, 8),
    branchMaterial
  );

  branch.position.set(
    -3.35 + (i - 1) * 0.09,
    2.2,
    -0.55
  );

  branch.rotation.z = (i - 1) * 0.25;
  scene.add(branch);
}

// Dekorim metalik në formë rrethi
const decorRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.19, 0.025, 12, 40),
  decorGold
);

decorRing.position.set(-3.35, 1.55, 0.55);
decorRing.rotation.y = Math.PI / 2;
scene.add(decorRing);

// Dy libra dekorativë
const book1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.35, 0.07, 0.55),
  decorDark
);

book1.position.set(-3.35, 1.38, 0.55);
scene.add(book1);

const book2 = new THREE.Mesh(
  new THREE.BoxGeometry(0.32, 0.06, 0.5),
  decorCream
);

book2.position.set(-3.35, 1.45, 0.55);
scene.add(book2);

// Një objekt i vogël dekorativ ari
const decorSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.11, 24, 24),
  decorGold
);

decorSphere.position.set(-3.35, 1.65, 0.55);
scene.add(decorSphere);


// 24. RAFT MODERN I LIBRAVE

const shelfWood = new THREE.MeshStandardMaterial({
  color: 0x493326,
  roughness: 0.55
});

const shelfBack = new THREE.MeshStandardMaterial({
  color: 0x674a35,
  roughness: 0.7
});

// Trupi i raftit - dy anët vertikale
for (const z of [1.1, 2.0]) {
  const side = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 1.85, 0.07),
    shelfWood
  );

  side.position.set(-3.5, 0.95, z);
  side.castShadow = true;
  scene.add(side);
}

// Pjesa e pasme
const shelfRear = new THREE.Mesh(
  new THREE.BoxGeometry(0.07, 1.85, 0.9),
  shelfBack
);

shelfRear.position.set(-3.77, 0.95, 1.55);
scene.add(shelfRear);

// Raftet horizontale
const shelfLevels = [0.08, 0.53, 0.98, 1.43, 1.88];

shelfLevels.forEach((y) => {
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.06, 0.95),
    shelfWood
  );

  shelf.position.set(-3.5, y, 1.55);
  shelf.castShadow = true;
  shelf.receiveShadow = true;
  scene.add(shelf);
});

// Librat dekorativë
const bookMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xb49a7d }),
  new THREE.MeshStandardMaterial({ color: 0x554033 }),
  new THREE.MeshStandardMaterial({ color: 0xd8c8b2 }),
  new THREE.MeshStandardMaterial({ color: 0x77745c }),
  new THREE.MeshStandardMaterial({ color: 0x8c6650 })
];

function addBook(z, y, height, material, rotation = 0) {
  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, height, 0.10),
    material
  );

  book.position.set(-3.31, y + height / 2, z);
  book.rotation.x = rotation;
  book.castShadow = true;
  scene.add(book);
}

// Librat në raftin e parë
addBook(1.25, 0.12, 0.29, bookMaterials[0]);
addBook(1.37, 0.12, 0.32, bookMaterials[1]);
addBook(1.49, 0.12, 0.27, bookMaterials[2]);
addBook(1.61, 0.12, 0.34, bookMaterials[3]);

// Librat në raftin e tretë
addBook(1.25, 1.02, 0.30, bookMaterials[1]);
addBook(1.37, 1.02, 0.34, bookMaterials[2]);
addBook(1.49, 1.02, 0.28, bookMaterials[4]);

// Libra të vendosur horizontalisht në raftin e sipërm
const horizontalBook = new THREE.Mesh(
  new THREE.BoxGeometry(0.28, 0.07, 0.42),
  bookMaterials[0]
);

horizontalBook.position.set(-3.31, 1.55, 1.55);
scene.add(horizontalBook);

// Vazo e vogël dekorative në raftin e dytë
const shelfVase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.09, 0.12, 0.25, 24),
  new THREE.MeshStandardMaterial({
    color: 0xd9c5aa,
    roughness: 0.5
  })
);

shelfVase.position.set(-3.35, 0.72, 1.55);
shelfVase.castShadow = true;
scene.add(shelfVase);



// 25. VAZO MODERNE ME TRENDafila

// Materiali i vazos
const vase25Material = new THREE.MeshStandardMaterial({
  color: 0xd2bda5,
  roughness: 0.4,
  metalness: 0.08
});

// Forma e vazos
const vase25Points = [
  new THREE.Vector2(0.12, 0),
  new THREE.Vector2(0.28, 0.08),
  new THREE.Vector2(0.42, 0.3),
  new THREE.Vector2(0.46, 0.55),
  new THREE.Vector2(0.38, 0.8),
  new THREE.Vector2(0.22, 1.0),
  new THREE.Vector2(0.17, 1.2),
  new THREE.Vector2(0.18, 1.4),
  new THREE.Vector2(0.23, 1.42)
];

const vase25Geometry = new THREE.LatheGeometry(
  vase25Points,
  48
);

const vase25 = new THREE.Mesh(
  vase25Geometry,
  vase25Material
);

vase25.position.set(-3.55, 0.08, -3.3);
vase25.castShadow = true;
vase25.receiveShadow = true;
scene.add(vase25);


// Materialet e trëndafilave
const roseStemMaterial25 = new THREE.MeshStandardMaterial({
  color: 0x536b43,
  roughness: 0.85
});

const rosePetalMaterial25 = new THREE.MeshStandardMaterial({
  color: 0x762b3b,
  roughness: 0.65
});

const roseCenterMaterial25 = new THREE.MeshStandardMaterial({
  color: 0x4b1726,
  roughness: 0.7
});



// Buqetë me 7 trëndafila

for (let i = 0; i < 7; i++) {

  const angle25 = (i / 7) * Math.PI * 2;
  const radius25 = i === 0 ? 0 : 0.13;

  const roseX = -3.55 + Math.cos(angle25) * radius25;
  const roseZ = -3.3 + Math.sin(angle25) * radius25;

  const roseHeight = 1.65 + (i % 3) * 0.13;

  // Kërcelli
  const stem25 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.009, 0.014, roseHeight - 1.45, 8),
    roseStemMaterial25
  );

  stem25.position.set(
    roseX,
    (1.45 + roseHeight) / 2,
    roseZ
  );

  stem25.castShadow = true;
  scene.add(stem25);

  // Petalet
  const roseGroup25 = new THREE.Group();

  for (let j = 0; j < 10; j++) {
    const petalAngle25 = (j / 10) * Math.PI * 2;

    const petal25 = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 16, 12),
      rosePetalMaterial25
    );

    petal25.scale.set(1, 0.55, 0.65);

    petal25.position.set(
      Math.cos(petalAngle25) * 0.065,
      Math.sin(petalAngle25) * 0.065,
      0
    );

    roseGroup25.add(petal25);
  }

  // Qendra e trëndafilit
  const center25 = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 16, 12),
    roseCenterMaterial25
  );

  roseGroup25.add(center25);

  roseGroup25.position.set(
    roseX,
    roseHeight,
    roseZ
  );

  scene.add(roseGroup25);
}






// 24. Animimi dhe renderimi


// 21. Përshtatja me madhësinë e ekranit
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
