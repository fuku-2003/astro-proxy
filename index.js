const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.post("/astro", async (req, res) => {
  const { latitude, longitude, date, time } = req.body;

  try {
    // Step 1: Authenticate and get token
    const tokenResponse = await axios.post(
      "https://api.astronomyapi.com/api/v2/auth/token",
      {},
      {
        headers: {
          "Authorization": "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
          "Content-Length": "0"
        }
      }
    );

    const token = tokenResponse.data.data;

    // Step 2: Get planet positions
    const dataResponse = await axios.post(
      "https://api.astronomyapi.com/api/v2/bodies/positions",
      {
        latitude,
        longitude,
        elevation: 0,
        from_date: date,
        to_date: date,
        time
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(dataResponse.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch astronomical data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
