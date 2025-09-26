// utils/calcDistance.js

function toRad(x) {
  return (x * Math.PI) / 180;
}

// 計算兩點之間的地理距離（公里）
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球半徑 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 傳回距離使用者 X 公里以內的 AEDs（含距離）
function getAEDsWithin(aeds, userLat, userLng, maxDistanceKm = 1) {
  return aeds
    .map(aed => {
      const distance = haversine(userLat, userLng, aed.lat, aed.lng);
      return { ...aed, distance };
    })
    .filter(aed => aed.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance);
}

module.exports = {
  haversine,
  getAEDsWithin
};
