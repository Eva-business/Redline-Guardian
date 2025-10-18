const axios = require('axios');
const { fallbackWithGPT } = require('./Azure');

// === 用名稱或地址查 Place ID ===
async function findPlaceId(nameOrAddress) {
  const url = 'https://places.googleapis.com/v1/places:searchText';

  const payload = { textQuery: nameOrAddress };

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
    'X-Goog-FieldMask': 'places.id,places.displayName'
  };

  try {
    const response = await axios.post(url, payload, { headers });
    const places = response.data.places;

    return places && places.length > 0 ? places[0].id : null;
  } catch (error) {
    console.error('findPlaceId error:', error.response?.data || error.message);
    throw error;
  }
}

// === 查詢詳細資訊 ===
async function getPlaceDetails(placeId) {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  const params = {
    fields: 'id,displayName,internationalPhoneNumber,regularOpeningHours'
  };
  const headers = {
    'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
    'X-Goog-FieldMask': 'id,displayName,internationalPhoneNumber,regularOpeningHours'
  };

  try {
    const response = await axios.get(url, { params, headers });
    const result = response.data;

    let openNow = null;
    if (result.regularOpeningHours?.openNow !== undefined) {
      openNow = result.regularOpeningHours.openNow;
    }

    return {
      phone: result.internationalPhoneNumber || null,
      openNow
    };
  } catch (error) {
    console.error('getPlaceDetails error:', error.response?.data || error.message);
    throw error;
  }
}

// === 取得當前時間（給 GPT 用）===
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

// === 整合：先查 ID 再查細節 ===
async function getPlaceInfo(nameOrAddress) {
  const placeId = await findPlaceId(nameOrAddress);
  if (!placeId) return { phone: null, openNow: null };

  const details = await getPlaceDetails(placeId);

  if (details.openNow === null) {
    try {
      const gptResult = await fallbackWithGPT(nameOrAddress, getCurrentTime());
      details.openNow = gptResult === true;
    } catch (err) {
      console.error('GPT fallback error:', err);
    }
  }

  return details;
}

module.exports = { getPlaceInfo };
