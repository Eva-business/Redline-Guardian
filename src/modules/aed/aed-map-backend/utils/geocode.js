const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const GOOGLE_API_KEY =  process.env.GOOGLE_API_KEY;
const geocodeCache = new Map();

router.get("/", async (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(400).json({ error: "請提供地址參數 address" });
  }

  if (geocodeCache.has(address)) {
    return res.json(geocodeCache.get(address));
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&region=tw&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Google API 回應錯誤" });
    }

    const data = await response.json();

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      return res.status(404).json({ error: `找不到地址: ${address}` });
    }

    const location = data.results[0].geometry.location;
    const formatted_address = data.results[0].formatted_address;

    const result = {
      lat: location.lat,
      lng: location.lng,
      formatted_address,
    };

    geocodeCache.set(address, result);
    setTimeout(() => geocodeCache.delete(address), 10 * 60 * 1000);

    res.json(result);
  } catch (error) {
    console.error("Geocode 服務錯誤:", error);
    res.status(500).json({ error: "伺服器內部錯誤" });
  }
});

module.exports = router;
