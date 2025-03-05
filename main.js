import * as THREE from 'three';

// Tạo scene, camera và renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Tạo tòa nhà (hình hộp)
const buildingGeometry = new THREE.BoxGeometry(10, 20, 10);
const buildingMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
scene.add(building);

// Tạo cảm biến (hình cầu nhỏ)
function createSensor(x, y, z, color = 0xff0000) {
    const sensorGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const sensorMaterial = new THREE.MeshBasicMaterial({ color: color });
    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    sensor.position.set(x, y, z);
    scene.add(sensor);
    return sensor;
}

// Thêm một số cảm biến vào tòa nhà
const sensors = [
    createSensor(-3, 5, -3),  // Cảm biến tầng 1
    createSensor(2, 10, 2),   // Cảm biến tầng 2
    createSensor(-2, 15, 3),  // Cảm biến tầng 3
];

// Đặt vị trí camera và render
camera.position.z = 25;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
