import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// 從環境變數讀取 Google Maps API Key
const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// 動態插入 Google Maps script
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`;
script.async = true;
script.defer = true;
document.head.appendChild(script);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
