const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const AEDs = require('./data/aeds.json');
const { haversine, getAEDsWithin } = require('./utils/calcDistance');
const { getPlaceInfo } = require('./utils/googlePlace');
const geocodeRouter = require("./utils/geocode");
const  { groupByAddress } = require('./utils/groupByAddress');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// API：取得1公里內最近的5筆AED資料
app.get('/nearby', async (req, res) => {
  const userLat = parseFloat(req.query.lat);
  const userLng = parseFloat(req.query.lng);
  const radius = parseFloat(req.query.radius) || 0.7;

  if (!userLat || !userLng) {
    return res.status(400).json({ error: 'lat and lng are required' });
  }

  const withDistance = AEDs.map(aed => {
    const distance = haversine(userLat, userLng, aed.lat, aed.lng);
    return { ...aed, distance };
  });

  const nearby = withDistance
    .filter(aed => aed.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  const grouped = groupByAddress(nearby).slice(0, 5);

  // 對每筆 AED 查詢 Google Place 詳細資料
  const enriched = await Promise.all(
  grouped.map(async group => {
    const aedsWithInfo = await Promise.all(
      group.aeds.map(async (aed) => {
        const placeInfo = await getPlaceInfo(aed.name);
        return {
          ...aed,
          openNow: placeInfo.openNow ?? null,
          phone: placeInfo.phone ?? null,
        };
      })
    );

    return {
      ...group,
      aeds: aedsWithInfo,
    };
  })
);

  res.json(enriched);
});

app.use("/geocode", geocodeRouter);

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`✅ AED API 伺服器啟動：http://localhost:${PORT}`);
});
