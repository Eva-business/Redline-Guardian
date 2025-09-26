let lat, lon;


function initApp() {
  const locationP = document.getElementById("location");
  const addressP = document.getElementById("address");
  const getLocationBtn = document.getElementById("get-location");
  const callBtn = document.getElementById("call-emergency");
  const confirmCallBtn = document.getElementById("confirm-call");
  const streetBtn = document.getElementById("show-street-view");
  const streetDiv = document.getElementById("street-view");

  getLocationBtn.addEventListener("click", () => {
    locationP.style.display = "none";
    addressP.style.display = "none";
    streetBtn.style.display = "none"; // 每次點之前先隱藏街景按鈕

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          locationP.innerText = `緯度：${lat.toFixed(6)}，經度：${lon.toFixed(6)}，精確度：約 ±${Math.round(accuracy)} 公尺`;
          locationP.style.display = "block";

          // ✅ 顯示街景按鈕
          streetBtn.style.display = "inline-block";

          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=zh-TW`;

          try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === "OK") {
              const address = data.results[0].formatted_address;
              addressP.innerText = `地址：${address}`;
            } else {
              addressP.innerText = "查詢地址失敗：" + data.status;
            }
          } catch (error) {
            addressP.innerText = "查詢地址失敗";
          }
          addressP.style.display = "block";
        },
        (error) => {
          locationP.innerText = "無法取得定位：" + error.message;
          locationP.style.display = "block";
          addressP.innerText = "";
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      locationP.innerText = "您的瀏覽器不支援定位功能";
      locationP.style.display = "block";
      addressP.innerText = "";
    }
  });

  callBtn.addEventListener("click", () => {
    confirmCallBtn.style.display = "inline-block";
    confirmCallBtn.onclick = () => {
      window.location.href = "tel:119";
    };
  });

  streetBtn.addEventListener("click", () => {
    if (lat && lon) {
      streetDiv.style.display = "block";
      new google.maps.StreetViewPanorama(streetDiv, {
        position: { lat: lat, lng: lon },
        pov: { heading: 165, pitch: 0 },
        zoom: 1
      });
    } else {
      alert("請先點選「取得目前位置」");
    }
  });
}

// 讓 Google Maps 載入完呼叫這個函式
window.initApp = initApp;
