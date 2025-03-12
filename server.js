import express from "express";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors());
app.use(express.json());

const PORT = 3000;
const SENSOR_API_URL = "https://s16tc-prtg1-vp.vingroup.local/api/table.json";
const API_PARAMS = {
    id: 20694,
    content: "sensors",
    columns: "objid,device,host,name,status",
    filter_status: 5,
    user: "admin.tannm11",
    passhash: "Tan@0398017585",
};

async function fetchDownSensors() {
    try {
        const response = await axios.post(SENSOR_API_URL, { params: API_PARAMS });
        return response.data;
    } catch (error) {
        console.error("Error fetching sensor data:", error);
        return null;
    }
}

io.on("connection", (socket) => {
    console.log("Client connected");
    
    socket.on("getSensors", async () => {
        const data = await fetchDownSensors();
        if (data) {
            socket.emit("sensorData", data);
        }
    });
    
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

setInterval(async () => {
    const data = await fetchDownSensors();
    if (data) {
        io.emit("sensorData", data);
    }
}, 10000);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
