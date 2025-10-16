let lat, lon;

function initApp() {
  const containers = document.querySelectorAll(".container");

  containers.forEach((container) => {
    const locationP = container.querySelector(".location");
    const addressP = container.querySelector(".address");
    const getLocationBtn = container.querySelector(".get-location");
    const callBtn = container.querySelector(".call-emergency");
    const confirmCallBtn = container.querySelector(".confirm-call");
    const streetBtn = container.querySelector(".show-street-view");
    const streetDiv = container.querySelector(".street-view");

    if (!getLocationBtn || !callBtn || !streetBtn) return; // 沒有這組按鈕就略過

    getLocationBtn.addEventListener("click", async () => {
      // 先清空狀態
      locationP.style.display = "none";
      addressP.style.display = "none";
      streetBtn.style.display = "none";
      if (streetDiv) streetDiv.innerHTML = "";

      if (!navigator.geolocation) {
        locationP.textContent = "您的瀏覽器不支援定位功能";
        locationP.style.display = "block";
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          locationP.textContent = `緯度：${lat.toFixed(6)}，經度：${lon.toFixed(
            6
          )}，精確度：約 ±${Math.round(accuracy)} 公尺`;
          locationP.style.display = "block";

          // 顯示街景按鈕
          streetBtn.style.display = "inline-block";

          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          if (!apiKey) {
            addressP.textContent = "⚠️ 未設定 Google Maps API Key";
            addressP.style.display = "block";
            return;
          }

          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=zh-TW`;

          try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === "OK") {
              const address = data.results[0].formatted_address;
              addressP.textContent = `地址：${address}`;
            } else {
              addressP.textContent = `查詢地址失敗：${data.status}`;
            }
          } catch {
            addressP.textContent = "查詢地址失敗（請檢查網路）";
          }

          addressP.style.display = "block";
        },
        (error) => {
          locationP.textContent = "無法取得定位：" + error.message;
          locationP.style.display = "block";
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });

    // 撥打電話
    callBtn.addEventListener("click", () => {
      confirmCallBtn.style.display = "inline-block";
      confirmCallBtn.onclick = () => {
        window.location.href = "tel:119";
      };
    });

    // 顯示街景
    streetBtn.addEventListener("click", () => {
      if (!lat || !lon) {
        alert("請先點選「取得目前位置」");
        return;
      }

      if (streetDiv) {
        streetDiv.style.display = "block";
        streetDiv.innerHTML = ""; // 清空舊的內容

        new google.maps.StreetViewPanorama(streetDiv, {
          position: { lat, lng: lon },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        });
      }
    });
  });
}

// 讓 Google Maps 載入完呼叫這個函式
window.initApp = initApp;
