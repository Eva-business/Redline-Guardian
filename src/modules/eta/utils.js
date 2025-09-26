import fuzzysort from 'fuzzysort';
import hospitalData from './csvjson.json';

// 📌 資料預處理，加上別名的比對資料欄位
const indexedHospitals = hospitalData.map(hospital => {
  const normalizedName = hospital.機構名稱.replace(/臺/g, '台');
  const normalizedAddress = hospital.機構地址.replace(/臺/g, '台');

  // 讓 aliases 保證為陣列（即使原始是空字串）
  const aliases = Array.isArray(hospital.aliases)
    ? hospital.aliases
    : (typeof hospital.aliases === 'string' && hospital.aliases.trim() !== '' ? [hospital.aliases] : []);

  const normalizedAliases = aliases.map(alias => alias.replace(/臺/g, '台'));

  // 把所有 alias 也合併到 searchTarget 內
  const aliasText = normalizedAliases.join(' ');

  return {
    ...hospital,
    normalizedName,
    normalizedAddress,
    normalizedAliases,
    searchTarget: `${normalizedName} ${aliasText} ${normalizedAddress}`
  };
});

// 📌 地址標準化
function cleanAddress(rawAddress) {
  return rawAddress
    .replace(/^(\d{3,5})?(台灣|臺灣)?/, '') // 移除郵遞區號與台灣
    .replace(/臺/g, '台') // 統一「臺」為「台」
    .trim();
}

// 📌 主函數
export function findBestMatchedHospital(name, address) {
  const cleanedAddress = cleanAddress(address);
  const normalizedName = name.replace(/臺/g, '台');
  const query = `${normalizedName} ${cleanedAddress}`;

  console.log("🧭 地圖名稱：", name);
  console.log("📍 原始地址：", address);
  console.log("🏷️ 清理後地址：", cleanedAddress);
  console.log("🔍 搜尋字串：", query);
  
  // 🧪 取得使用者輸入的縣市（前面兩到三個字）
  const locationPrefix = cleanedAddress.slice(0, 3); // e.g. 台北市、新北市、桃園市、嘉義縣

  // 🧹 根據縣市先過濾掉不同區域的醫院，避免誤判
  const sameCityHospitals = indexedHospitals.filter(h => 
    h.normalizedAddress.startsWith(locationPrefix)
  );

  if (sameCityHospitals.length === 0) {
    console.log("🛑 無相同縣市的醫院，停止模糊比對");
    return null;
  }

  // 1️⃣ 地址完全比對
  const exactAddressMatch = sameCityHospitals.find(h => cleanedAddress === h.normalizedAddress);
  if (exactAddressMatch) {
    console.log("✅ 地址完全相符，直接回傳此筆");
    return exactAddressMatch;
  }

  // 2️⃣ 地址模糊比對（僅限相同縣市）
  const fuzzyAddressResults = fuzzysort.go(cleanedAddress, sameCityHospitals, {
    key: 'normalizedAddress',
    threshold: -1000,
    limit: 1
  });
  if (fuzzyAddressResults.length > 0) {
    console.log(`🏠 地址模糊比對成功，分數：${fuzzyAddressResults[0].score}`);
    return fuzzyAddressResults[0].obj;
  }

  // 3️⃣ 名稱+地址模糊比對
  const combinedResults = fuzzysort.go(query, sameCityHospitals, {
    key: 'searchTarget',
    threshold: -1000,
    limit: 1
  });
  if (combinedResults.length > 0) {
    console.log("✅ 名稱+地址模糊比對成功，分數：", combinedResults[0].score);
    return combinedResults[0].obj;
  }

  // 4️⃣ 名稱模糊比對（保底）
  const nameOnlyResults = fuzzysort.go(normalizedName, sameCityHospitals, {
    key: 'normalizedName',
    threshold: -5000,
    limit: 1
  });
  if (nameOnlyResults.length > 0) {
    console.log("⚠️ 名稱模糊比對成功（保底），分數：", nameOnlyResults[0].score);
    return nameOnlyResults[0].obj;
  }

  // 5️⃣ ➕ NEW: 用 aliases 單獨模糊比對名稱
  for (const hospital of sameCityHospitals) {
    for (const alias of hospital.normalizedAliases || []) {
      const result = fuzzysort.single(normalizedName, alias);
      if (result !== null && result.score > -1000) {
        console.log("🪪 別名模糊比對成功：", alias, "→", hospital.機構名稱);
        return hospital;
      }
    }
  }

  // ❌ 都沒有找到
  console.log("❌ 模糊比對找不到結果");
  return null;
}