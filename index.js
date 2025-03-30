const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 環境変数確認用のルート
app.get("/", (req, res) => {
    res.json({
        client_id: process.env.ASTRO_CLIENT_ID || "❌ ASTRO_CLIENT_ID が未定義です",
        secret: process.env.ASTRO_SECRET ? "✅ ASTRO_SECRET は設定されています" : "❌ ASTRO_SECRET が未定義です"
    });
});

app.listen(PORT, () => {
    console.log(`🌍 TEST Server running on port ${PORT}`);
});
