
import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

camera.position.z = 3;

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Roof - cone
const roofGeometry = new THREE.ConeGeometry(0.8, 0.7, 4);
const roofMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 0.8;
scene.add(roof);

// Chimney - cylinder
const chimneyGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
const chimneyMaterial = new THREE.MeshBasicMaterial({color: 0x808080});
const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
chimney.position.set(0.3, 1.1, 0);
scene.add(chimney);

const light = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(light);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene').appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
