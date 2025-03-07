import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";


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
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, transparent: true, opacity: 0.4 }); // Màu tường

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

//Sàn tầng 2
createWall(30, 0.2, 30, { x: 0, y: 5, z: 0 });

const roomMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, transparent: true, opacity: 0.4 }); // Màu phòng học

// Hàm tạo phòng học
function createRoom(width, height, depth, position) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const room = new THREE.Mesh(geometry, roomMaterial);
    room.position.set(position.x, position.y, position.z);
    scene.add(room);
}

// Tạo một số phòng tầng 1
createRoom(4, 4, 4, { x: -10, y: 2, z: -10 });
createRoom(4, 4, 4, { x: -5, y: 2, z: -10 });
createRoom(4, 4, 4, { x: 0, y: 2, z: -10 });
createRoom(4, 4, 4, { x: 5, y: 2, z: -10 });
createRoom(4, 4, 4, { x: 10, y: 2, z: -10 });

// Tạo một số phòng tầng 2
createRoom(4, 4, 4, { x: -10, y: 7, z: -10 });
createRoom(4, 4, 4, { x: -5, y: 7, z: -10 });
createRoom(4, 4, 4, { x: 0, y: 7, z: -10 });
createRoom(4, 4, 4, { x: 5, y: 7, z: -10 });
createRoom(4, 4, 4, { x: 10, y: 7, z: -10 });

// Tạo mặt đất
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


// Tạo cảm biến (hình cầu nhỏ)
const sensorMap = []; // Lưu danh sách cảm biến với ID làm key

function createSensor(x, y, z, id, color = 0xff0000) {
    const sensorGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: color, emissive: color });
    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);

    sensor.position.set(x, y, z);
    scene.add(sensor);
    
    sensorMap.push({ id: id, mesh: sensor});
}

// Tạo CSS2DRenderer để hiển thị label
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

// Hàm tạo label
function createLabel(text, targetObject) {
    const div = document.createElement("div");
    div.className = "sensor-label";
    div.textContent = text;
    div.style.fontSize = "10px";
    div.style.color = "rgba(250, 250, 250, 0.4)";
    div.style.padding = "5px";
    div.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    div.style.borderRadius = "5px";

    const label = new CSS2DObject(div);
    label.position.copy(targetObject.position); // Gán vị trí ban đầu
    scene.add(label);

    return label;
}

// Thêm một số cảm biến
createSensor(-10, 8.5, -10, "SENSOR_1"); // Xa tường
createSensor(10, 5, 10, "SENSOR_2");   // Xa tường
createSensor(0, 3.5, -10, "SENSOR_3");     // Giữa sân trường

const a = sensorMap.find(s=>s.id==="SENSOR_1");
createLabel(a.id, a.mesh);


// Đặt vị trí camera
camera.position.set(15, 15, 25);
controls.update(); // Cập nhật vị trí camera

// Cập nhật vị trí camera khi render
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera); // Luôn cập nhật labelRenderer
}

animate();

// Đảm bảo canvas cập nhật khi thay đổi kích thước cửa sổ
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


async function getDownSensors() {
    const response = await fetch("https://s16tc-prtg1-vp.vingroup.local/api/table.json?id=20694&content=sensors&columns=objid,device,host,name,status&filter_status=5",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors"
        }
    ).then(response => response.json())
    .then(data => console.log(data));
}

// Gọi API mỗi 10 giây
setInterval(getDownSensors, 10000);
