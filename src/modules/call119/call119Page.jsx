import React, { useEffect, useState } from "react";
import styles from "./style.module.css";

const Call119Page = () => {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [locationText, setLocationText] = useState("");
  const [addressText, setAddressText] = useState("");
  const [showStreetView, setShowStreetView] = useState(false);
  const [streetViewObj, setStreetViewObj] = useState(null);

  useEffect(() => {
    // 載入 Google Maps API script
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_119_API_KEY}`;
      script.async = true;
      script.onload = () => {
        console.log("Google Maps API loaded");
      };
      document.head.appendChild(script);
    }
  }, []);

  const getLocation = () => {
    setLocationText("");
    setAddressText("");
    setShowStreetView(false);
    if (!navigator.geolocation) {
      setLocationText("您的瀏覽器不支援定位功能");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
        setLocationText(
          `緯度：${pos.coords.latitude.toFixed(
            6
          )}，經度：${pos.coords.longitude.toFixed(6)}，精確度：約 ±${Math.round(
            pos.coords.accuracy
          )} 公尺`
        );

        // 反查地址
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=${import.meta.env.VITE_GOOGLE_119_MAPS_API_KEY}&language=zh-TW`
          );
          const data = await res.json();
          if (data.status === "OK") {
            setAddressText(`地址：${data.results[0].formatted_address}`);
          } else {
            setAddressText("查詢地址失敗：" + data.status);
          }
        } catch {
          setAddressText("查詢地址失敗");
        }
      },
      (err) => {
        setLocationText("無法取得定位：" + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const callEmergency = () => {
    if (
      window.confirm(
        "確定要撥打119嗎？（手機會跳出撥號畫面，請確認後撥出）"
      )
    ) {
      window.location.href = "tel:119";
    }
  };

  const toggleStreetView = () => {
    if (!lat || !lon) {
      alert("請先取得目前位置");
      return;
    }
    if (!showStreetView) {
      const panorama = new window.google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        {
          position: { lat, lng: lon },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        }
      );
      setStreetViewObj(panorama);
      setShowStreetView(true);
    } else {
      setShowStreetView(false);
      if (streetViewObj) {
        streetViewObj.setVisible(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>撥打119與地址查詢功能</h1>

      <details className={styles.details}>
        <summary>撥打119流程</summary>
        <p>
          <strong>1.</strong> 保持冷靜，先確認傷患意識狀態與是否有危險。
        </p>
        <p>
          <strong>2.</strong> 立即撥打119，說明「發生什麼事、在哪裡、多少人受傷」。
        </p>
        <p>
          <strong>3.</strong> 可先點擊下方「取得目前位置」快速定位。
        </p>
        <p>
          <strong>4.</strong> 持續關注傷患狀況並等待救護車。
        </p>
      </details>

      <div className={styles.buttonContainer}>
        <div className={styles.firstRow}>
          <button onClick={getLocation}>取得目前位置</button>
          <button onClick={callEmergency}>撥打緊急電話</button>
          {lat && lon && (
            <button onClick={toggleStreetView}>
              {showStreetView ? "隱藏街景" : "顯示街景"}
            </button>
          )}
        </div>
      </div>

      <p className={styles.location}>{locationText}</p>
      <p className={styles.address}>{addressText}</p>

      <div
        id="street-view"
        className={styles.streetView}
        style={{ display: showStreetView ? "block" : "none" }}
      ></div>
    </div>
  );
};

export default Call119Page;
