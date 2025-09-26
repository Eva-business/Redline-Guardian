import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import AEDIcon from "./AEDicon.jpeg";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const fallbackPosition = {
  lat: 25.1715,
  lng: 121.4385,
};

export default function UserLocationMap() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [aeds, setAeds] = useState([]);
  const [selectedAED, setSelectedAED] = useState(null);
  const [directions, setDirections] = useState(null);
  const [noAEDMsg, setNoAEDMsg] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_AED_MAPS_API_KEY,
  });

  const onLoad = (map) => {
    mapRef.current = map;
  };

  // 嘗試取得使用者定位
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("✅ 定位成功");
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("❌ 定位失敗，fallback 淡水");
        setCurrentPosition(fallbackPosition);
      }
    );
  }, []);

  // 取得附近 AED
useEffect(() => {
  console.log("currentPosition changed:", currentPosition);
  if (!currentPosition) return;

  const fetchAEDs = async () => {
    console.log("開始fetch AEDs");
    setAeds([]);
    setSelectedAED(null);

    try {
      const url = `http://localhost:3001/nearby?lat=${currentPosition.lat}&lng=${currentPosition.lng}`;
      console.log("fetch URL:", url);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("HTTP status " + res.status);
      }
      const data = await res.json();
      console.log("fetch AEDs 回傳資料", data);
      const firstFive = data.slice(0, 5);

      if (firstFive.length === 0) {
        setNoAEDMsg(true);
        setAeds([]);
        setTimeout(() => {
          setNoAEDMsg(false);
        }, 2500);
        return;
      } else {
        setNoAEDMsg(false);
      }

      const coordCount = {};
      firstFive.forEach((aed) => {
        const key = `${aed.lat},${aed.lng}`;
        coordCount[key] = (coordCount[key] || 0) + 1;
      });

      const jitter = (value) => value + (Math.random() - 0.5) * 0.00005;

      const aedsWithCoords = firstFive.map((aed) => {
        const key = `${aed.lat},${aed.lng}`;
        const isDuplicate = coordCount[key] > 1;

        return {
          ...aed,
          lat: isDuplicate ? jitter(aed.lat) : aed.lat,
          lng: isDuplicate ? jitter(aed.lng) : aed.lng,
        };
      });

      setAeds(aedsWithCoords.filter(Boolean));
      console.log("AEDs 資料：", aedsWithCoords); // 這裡印出
      console.log("設置 aeds 完成", aedsWithCoords);
    } catch (err) {
      console.error("AED 載入錯誤:", err);
    }
  };

  fetchAEDs();
}, [currentPosition]);


  // AED 或位置更新 → 自動調整地圖範圍
  useEffect(() => {
    if (!mapRef.current || aeds.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(currentPosition);
    aeds.forEach((aed) => {
      bounds.extend({ lat: aed.lat, lng: aed.lng });
    });
    mapRef.current.fitBounds(bounds);
  }, [aeds, currentPosition]);

  // 搜尋地址
  const handleSearch = async () => {
    if (!inputAddress.trim()) return alert("請輸入地址");

    try {
      const res = await fetch(
        `http://localhost:3001/geocode?address=${encodeURIComponent(inputAddress)}`
      );
      const data = await res.json();

      if (data.lat && data.lng) {
        setCurrentPosition({ lat: data.lat, lng: data.lng });
        setSelectedAED(null);
        setDirections(null);
      } else {
        alert("找不到該地址，請確認輸入");
      }
    } catch (err) {
      alert("定位失敗，請稍後再試");
    }
  };

  const handleShowDirections = async (aed) => {
    setSelectedAED(null);
    if (currentPosition && aed) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentPosition,
          destination: { lat: aed.lat, lng: aed.lng },
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error("路線規劃失敗", result);
          }
        }
      );
      setDirections(result);
    }
  };

  const openGoogleMaps = (aed) => {
    const origin = `${currentPosition.lat},${currentPosition.lng}`;
    const destination = `${aed.lat},${aed.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
    window.open(url, "_blank");
  };

  if (!isLoaded) {
    return <div>正在載入地圖...</div>;
  }

  return (
    <>
     <div style={{ padding: "1rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>AED 地圖</h1>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="請輸入地址"
          style={{
            flex: "1 1 250px",
            maxWidth: "70%",
            padding: "0.5rem",
            fontSize: "1rem",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
          }}
        >
          搜尋
        </button>
      </div>

      {noAEDMsg && (
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "30px 40px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            maxWidth: "90%", textAlign: "center",
          }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", transform: "translateY(3px)" }}>
              ⚠️ 一公里內暫無 AED
            </div>
            <button onClick={() => setNoAEDMsg(false)} style={{
              position: "absolute", top: 10, right: 10,
              background: "transparent", border: "none", fontSize: "18px", cursor: "pointer",
            }}>
              ✖
            </button>
          </div>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        center={currentPosition}
        zoom={17}
        options={{
          gestureHandling: "greedy",
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          draggable: true,
          scrollwheel: true,
        }}
      >
        <Marker
          position={currentPosition}
          draggable={true}
          onDragEnd={(e) => {
            setCurrentPosition({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
            setSelectedAED(null);
            setDirections(null);
          }}
          icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
        />

        {aeds.map((group, idx) => (
          <Marker
            key={idx}
            position={{ lat: group.lat, lng: group.lng }}
            onClick={() => {
              setSelectedAED(group); //  傳入整個 group
              setDirections(null);   // 如果之前有路線，清除它
            }}
            icon={{ url: AEDIcon, scaledSize: new window.google.maps.Size(32, 32) }}
          />
        ))}

        {selectedAED && (
          <InfoWindow
            position={{ lat: selectedAED.lat, lng: selectedAED.lng }}
            onCloseClick={() => {
              setSelectedAED(null);
              setDirections(null);
            }}
            maxWidth={300}
          >
            <div style={{ maxWidth: "250px", fontSize: "0.95rem", lineHeight: "1.5" }}>
              {selectedAED.aeds.map((aed, idx) => (
              <div key={idx} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
                <div><strong>場地名稱：</strong>{aed.name}</div>
                <div><strong>放置位置：</strong>{aed.location || "無資料"}</div>
                <div><strong>營業狀態：</strong>
                  <span style={{
                    color: aed.openNow === true ? "green"
                          : aed.openNow === false ? "red" : "gray",
                    fontWeight: "bold",
                  }}>
                    {aed.openNow === true && "營業中"}
                    {aed.openNow === false && "休息中"}
                    {(aed.openNow === null || aed.openNow === undefined) && "無資料"}
                  </span>
                </div>
                <div><strong>聯絡電話：</strong>{aed.phone || "無資料"}</div>
              </div>
            ))}
              <button onClick={() => handleShowDirections(selectedAED)}>顯示路線</button>
              <button onClick={() => openGoogleMaps(selectedAED)}>用 Google 導航</button>
            </div>
          </InfoWindow>
        )}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>

    </>
  );
}
