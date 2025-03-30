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
        // 🔐 トークン取得
        const tokenRes = await axios.post("https://api.astronomyapi.com/api/v2/authenticate", {
            client_id: process.env.ASTRO_CLIENT_ID,
            client_secret: process.env.ASTRO_SECRET
        });

        console.log("🔐 トークン取得レスポンス:", tokenRes.data); // ← トークン内容を確認

        const token = tokenRes.data.data;

        if (!token) {
            throw new Error("トークン取得に失敗しました。空のトークンが返されました。");
        }

        // 🌌 惑星データ取得
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
        if (err.response) {
            console.error("🟥 サーバー応答エラー:", err.response.status, err.response.data);
            res.status(err.response.status).json({ error: err.response.data });
        } else if (err.request) {
            console.error("🟨 リクエストエラー:", err.request);
            res.status(500).json({ error: "No response received from AstronomyAPI" });
        } else {
            console.error("🟦 その他エラー:", err.message);
            res.status(500).json({ error: err.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`🌍 Server running on port ${PORT}`);
});
