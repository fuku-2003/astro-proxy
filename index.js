// ✅ 修正後の index.js（例）
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/planets", async (req, res) => {
    const { latitude, longitude, elevation, from_date, to_date, time } = req.body;

    try {
        // トークン取得
        const tokenRes = await axios.post("https://api.astronomyapi.com/api/v2/authenticate", {
            client_id: process.env.ASTRO_CLIENT_ID,
            client_secret: process.env.ASTRO_SECRET
        });

        const token = tokenRes.data.data;

        // 惑星位置取得
        const result = await axios.post(
            "https://api.astronomyapi.com/api/v2/bodies/positions",
            {
                latitude,
                longitude,
                elevation,
                from_date,
                to_date,
                time
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(result.data);
    } catch (err) {
        console.error("サーバーエラー:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🌍 Server running on port ${PORT}`);
});
