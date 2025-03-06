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
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Màu tường

// Hàm tạo tường
function createWall(width, height, depth, position) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(geometry, wallMaterial);
    wall.position.set(position.x, position.y, position.z);
    scene.add(wall);
    return wall;
}

// Tạo các bức tường hình chữ U
createWall(30, 10, 2, { x: 0, y: 5, z: -15 }); // Tường dưới
createWall(2, 10, 30, { x: -15, y: 5, z: 0 }); // Tường trái
createWall(2, 10, 30, { x: 15, y: 5, z: 0 });  // Tường phải

const roomMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 }); // Màu phòng học

// Hàm tạo phòng học
function createRoom(width, height, depth, position) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const room = new THREE.Mesh(geometry, roomMaterial);
    room.position.set(position.x, position.y, position.z);
    scene.add(room);
}

// Tạo một số phòng
createRoom(8, 8, 8, { x: -10, y: 4, z: -5 });
createRoom(8, 8, 8, { x: 0, y: 4, z: -5 });
createRoom(8, 8, 8, { x: 10, y: 4, z: -5 });

// Tạo mặt đất
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

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
