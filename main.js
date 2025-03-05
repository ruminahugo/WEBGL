import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


// Khởi tạo Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Thêm OrbitControls để điều khiển camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Hiệu ứng quán tính khi xoay
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;  // Giới hạn zoom gần
controls.maxDistance = 50; // Giới hạn zoom xa
controls.maxPolarAngle = Math.PI / 2; // Giữ camera không quay xuống dưới sàn

// Tạo mô hình tòa nhà
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

// Thêm một số cảm biến
const sensors = [
    createSensor(-3, 5, -3),
    createSensor(2, 10, 2),
    createSensor(-2, 15, 3),
];

// Đặt vị trí camera
camera.position.set(15, 15, 25);
controls.update(); // Cập nhật vị trí camera

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Cập nhật điều khiển camera
    renderer.render(scene, camera);
}
animate();

// Đảm bảo canvas cập nhật khi thay đổi kích thước cửa sổ
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
