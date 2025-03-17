import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.get("/prtg-data", async (req, res) => {
    try {
        const response = await fetch("https://s16tc-prtg1-vp.vingroup.local/table.json");
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Không thể lấy dữ liệu từ PRTG" });
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
