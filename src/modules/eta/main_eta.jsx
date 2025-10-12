// main_eta.jsx
import { useEffect, useState, useRef } from "react";
import HospitalCard from "./hospitalCard";
import hospitalDetails from "./csvjson.json";
import { findBestMatchedHospital as fuzzyMatchHospital } from "./utils";

import "./etaPage.css"; // 確保這行有存在

function App() {
  const [userAddress, setUserAddress] = useState("定位中...");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [etaList, setEtaList] = useState([]);
  const [latLng, setLatLng] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const directionsService = useRef(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!window.google) {
      setErrorMsg("❌ Google Maps SDK 尚未載入");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLatLng(position);
        setLoading(false);
      },
      (err) => {
        setErrorMsg("❌ 定位失敗：" + err.message);
        setUserAddress("無法取得位置");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!latLng) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: latLng,
      zoom: 14,
    });

    markerInstance.current = new window.google.maps.Marker({
      position: latLng,
      map: mapInstance.current,
      draggable: true,
      title: "拖曳此標記調整位置",
    });

    directionsService.current = new window.google.maps.DirectionsService();

    markerInstance.current.addListener("dragend", () => {
      const pos = markerInstance.current.getPosition();
      if (pos) {
        const newLatLng = { lat: pos.lat(), lng: pos.lng() };
        setLatLng(newLatLng);
      }
    });
  }, [latLng]);

  useEffect(() => {
    if (!latLng || !directionsService.current) return;

    const fetchHospitalsAndETA = async () => {
      setLoading(true);
      setErrorMsg("");
      setEtaList([]);
      setUserAddress("定位中...");

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          setUserAddress(results[0].formatted_address);
        } else {
          setUserAddress("無法取得地址");
        }
      });

      try {
        const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask": "places.displayName,places.location",
          },
          body: JSON.stringify({
            includedTypes: ["hospital"],
            maxResultCount: 20,
            locationRestriction: {
              circle: {
                center: { latitude: latLng.lat, longitude: latLng.lng },
                radius: 15000,
              },
            },
          }),
        });

        const data = await response.json();
        const hospitals = data.places || [];

        const excludeKeywords = ["診所", "動物", "獸醫", "護理之家", "櫃員機"];
        const normalizeText = (text) =>
          (text || "").toLowerCase().replace(/[　\s()【】《》、;；-]/g, "").trim();

        const realHospitals = hospitals.filter((place) => {
          const nameRaw = place.displayName?.text || "";
          const name = normalizeText(nameRaw);
          const isHospital = name.includes("醫院");
          const hasExcluded = excludeKeywords.some((kw) => name.includes(kw));
          return isHospital && !hasExcluded;
        });

        if (realHospitals.length === 0) {
          setErrorMsg("⚠️ 查無符合條件的醫院");
          setLoading(false);
          return;
        }

        // 先全部計算 ETA，再依照距離排序，選擇最近 10 家
        const etaResultsAll = await Promise.all(
          realHospitals.map((place) =>
            new Promise((resolve) => {
              directionsService.current.route(
                {
                  origin: latLng,
                  destination: {
                    lat: place.location.latitude,
                    lng: place.location.longitude,
                  },
                  travelMode: google.maps.TravelMode.DRIVING,
                  drivingOptions: { departureTime: new Date() },
                },
                (result, status) => {
                  if (status === "OK") {
                    const leg = result.routes[0].legs[0];
                    resolve({
                      hospital: place.displayName.text,
                      address: leg.end_address,
                      eta: leg.duration.text,
                      etaValue: leg.duration.value, // 以秒為單位，用來排序
                      distance: leg.distance.text,
                    });
                  } else {
                    resolve(null); // 忽略失敗的項目
                  }
                }
              );
            })
          )
        );

        // 過濾失敗結果
        const successfulResults = etaResultsAll.filter(item => item !== null);

        // 依 ETA 時間排序，取前 10 家最近的
        const top10 = successfulResults
          .sort((a, b) => a.etaValue - b.etaValue)
          .slice(0, 5);

        setEtaList(top10);

      } catch (err) {
        setErrorMsg("🚨 資料載入失敗：" + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalsAndETA();
  }, [latLng]);

return (
  <div className="app-container">
    <h1 className="app-title">最近醫院及時資訊查詢</h1>
    <p className="location-info">你現在的位置：<strong>{userAddress}</strong></p>
    {errorMsg && <p className="error-msg">{errorMsg}</p>}

    <div ref={mapRef} className="map-box"></div>

    {loading ? (
      <p>🔄 資料載入中...</p>
    ) : (
      <ul className="hospital-list">
        {etaList.map((item, idx) => (
          <li
            key={idx}
            onClick={() => {
              const match = fuzzyMatchHospital(item.hospital, item.address, hospitalDetails);
              setSelectedHospital(match || null);
            }}
          >
             {item.hospital}  →  ⏱ {item.eta}（{item.distance}）
          </li>
        ))}
      </ul>
    )}

    {selectedHospital && (
      <HospitalCard
        hospital={selectedHospital}
        onClose={() => setSelectedHospital(null)}
      />
    )}

    <p className="hint-text">※ 可拖曳地圖上的標記，手動調整位置並重新查詢</p>
  </div>
);
}

export default App;
