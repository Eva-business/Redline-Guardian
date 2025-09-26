function getBaseAddress(address) {
  const index = address.lastIndexOf("號");
  return index !== -1 ? address.slice(0, index + 1) : address;
}

/**
 * 將 AED 清單依據「地址（號）」分組
 * @param {Array} aeds - AED 陣列（含 distance 欄位）
 * @returns {Array} 分組後的資料，每組包含 lat/lng/address/aeds[]
 */
function groupByAddress(aeds) {
  const grouped = {};

  for (const aed of aeds) {
    const baseAddr = getBaseAddress(aed.address);

    if (!grouped[baseAddr]) {
      grouped[baseAddr] = {
        lat: aed.lat,
        lng: aed.lng,
        address: baseAddr,
        aeds: [],
      };
    }

    grouped[baseAddr].aeds.push(aed);
  }

  return Object.values(grouped);
}

module.exports = { groupByAddress };
