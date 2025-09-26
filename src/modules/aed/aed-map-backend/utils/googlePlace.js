const axios = require('axios');
const { fallbackWithGPT } = require('./Azure'); 

// 用地址或名稱查詢 Place ID
async function findPlaceId(nameOrAddress) {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`;
  const params = {
    input: nameOrAddress,
    inputtype: 'textquery',
    fields: 'place_id',
    key: process.env.GOOGLE_API_KEY
  };

  const response = await axios.get(url, { params });
  const candidates = response.data.candidates;
  return candidates.length ? candidates[0].place_id : null;
}

// 查詢詳細資訊
async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json`;
  const params = {
    place_id: placeId,
    fields: 'international_phone_number,opening_hours',
    key: process.env.GOOGLE_API_KEY
  };

  const response = await axios.get(url, { params });
  const result = response.data.result;
  return {
    phone: result.international_phone_number || null,
    openNow: result.opening_hours?.open_now ?? null
  };
}

// 取得當前時間（用於 GPT 推論）
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// 結合：輸入名稱或地址 → 回傳詳細資訊，並用 GPT 補 openNow
async function getPlaceInfo(nameOrAddress) {
  const placeId = await findPlaceId(nameOrAddress);

  if (!placeId) return { phone: null, openNow: null };

  const details = await getPlaceDetails(placeId);

  // 如果 Google 沒有 openNow，呼叫 GPT fallback
  if (details.openNow === null) {
    try {
      const gptResult = await fallbackWithGPT(nameOrAddress, getCurrentTime());
      // gptResult 預期為布林 true / false，請確保 fallbackWithGPT 回傳這種格式
      details.openNow = gptResult === true;
    } catch (err) {
      console.error('GPT fallback error:', err);
      // fallback 失敗就保持 null
    }
  }

  return details;
}

module.exports = {
  getPlaceInfo
};
