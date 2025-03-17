import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/api/prtg", async (req, res) => {
    const response = await fetch("https://s16tc-prtg1-vp.vingroup.local/table.json?content=sensors&output=json&columns=sensor,status,lastvalue");
    const data = await response.json();
    res.json(data);
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
