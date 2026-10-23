
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(8, 6, 12);
camera.lookAt(0, 3, 0);


const armMaterial = new THREE.MeshStandardMaterial({color: 0x3399ff});
const jointMaterial = new THREE.MeshStandardMaterial({color: 0x555555});
const handMaterial = new THREE.MeshStandardMaterial({color: 0xffaa55});
const fingerMaterial = new THREE.MeshStandardMaterial({color: 0xffcc88});


const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const base = new THREE.Mesh(baseGeometry, jointMaterial);

scene.add(base);


const shoulder = new THREE.Group();
shoulder.position.y = 0.5;
base.add(shoulder);


const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), jointMaterial);

shoulder.add(shoulderJoint);


const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3, 0.7), armMaterial);

upperArm.position.y = 1.5;

shoulder.add(upperArm);

const elbow = new THREE.Group();
elbow.position.y = 3;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), jointMaterial);

elbow.add(elbowJoint);

const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.5, 0.6), armMaterial);

forearm.position.y = 1.25;

elbow.add(forearm);


const wrist = new THREE.Group();
wrist.position.y = 2.5;
elbow.add(wrist);


const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), jointMaterial);

wrist.add(wristJoint);


// Hand
const palm = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1.1, 0.4),
    handMaterial
);

palm.position.y = 0.7;

wrist.add(palm);


const fingers = [];

const fingerLengths = [0.65, 0.85, 0.95, 0.75];
const fingerWidths = [0.15, 0.17, 0.18, 0.16];

for (let i = 0; i < 4; i++) {

    const fingerJoint = new THREE.Group();

    fingerJoint.position.x = -0.42 + i * 0.28;
    fingerJoint.position.y = 0.45;

    palm.add(fingerJoint);

    const length = fingerLengths[i];
    const width = fingerWidths[i];

    const finger = new THREE.Mesh(
        new THREE.BoxGeometry(width, length, 0.16),
        fingerMaterial
    );

    finger.position.y = length / 2;

    fingerJoint.add(finger);


    const fingerTip = new THREE.Mesh(
        new THREE.SphereGeometry(width / 2, 16, 16),
        fingerMaterial
    );

    fingerTip.position.y = length;

    fingerJoint.add(fingerTip);

    fingers.push(fingerJoint);
}


// Thumb - left side of the palm
const thumbJoint = new THREE.Group();

thumbJoint.position.set(-0.62, 0.2, 0);
thumbJoint.rotation.z = 0.7;

palm.add(thumbJoint);

const thumb = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.6, 0.18),
    fingerMaterial
);

thumb.position.y = 0.3;

thumbJoint.add(thumb);


// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);

directionalLight.position.set(5, 10, 5);

scene.add(directionalLight);


// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: 0xcccccc
    })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.25;

scene.add(ground);

const grid = new THREE.GridHelper(
    20,
    20
);

scene.add(grid);


// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.getElementById('scene').appendChild(renderer.domElement);


// Orbit controls
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.target.set(0, 3, 0);

controls.enableDamping = true;

controls.update();


shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

const rotationStep = THREE.MathUtils.degToRad(5);
const thumbRotationStep = THREE.MathUtils.degToRad(5);


// Keyboard controls
window.addEventListener('keydown', function(event) {

    const key = event.key.toLowerCase();

    if (key === 'q') {
        shoulder.rotation.z += rotationStep;
    }

    if (key === 'a') {
        shoulder.rotation.z -= rotationStep;
    }

    if (key === 'w') {
        elbow.rotation.z += rotationStep;
    }

    if (key === 's') {
        elbow.rotation.z -= rotationStep;
    }

    if (key === 'e') {
        wrist.rotation.z += rotationStep;
    }

    if (key === 'd') {
        wrist.rotation.z -= rotationStep;
    }

    // Open and close all four fingers
    if (key === 'r') {
        fingers.forEach(function(finger) {
            finger.rotation.z -= rotationStep;
        });
    }

    if (key === 'f') {
        fingers.forEach(function(finger) {
            finger.rotation.z += rotationStep;
        });
    }

    // Move individual fingers with keys 1, 2, 3, 4
    if (key >= '1' && key <= '4') {
        const index = Number(key) - 1;
        fingers[index].rotation.z += rotationStep;
    }

    // Move thumb
    if (key === 't') {
        thumbJoint.rotation.z += thumbRotationStep;
    }

    if (key === 'g') {
        thumbJoint.rotation.z -= thumbRotationStep;
    }

});


function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();
