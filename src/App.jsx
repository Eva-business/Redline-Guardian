import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RoomMain from "./modules/room/RoomMain";

import Call119 from "./modules/call119/call119Page";
import AEDMap from "./modules/aed/aed-map-frontend/AEDMap";
import IncidentForm from "./modules/dataRecord/incidentPage";
import RescuePage from "./modules/rescue/rescuePage";
import EtaPage from "./modules/eta/etaPage"
import "./App.css";

const HomePage = () => {
  return (
    <div>
      <header className="main-header">
        生命衝線：智慧急救輔助系統
      </header>

      <main className="main-content">
        <Link to="/call119" className="feature-button">急救電話引導</Link>
        <Link to="/rescue" className="feature-button">辨識症狀急救</Link>
        <Link to="/aed" className="feature-button">AED 地圖</Link>
        <Link to="/etaPage" className="feature-button">醫院即時資訊</Link>
        <Link to="/room" className="feature-button">協救分工房間</Link>
      </main>

      <footer className="main-footer">
        &copy; 2025 生命衝線開發團隊｜Redline Guardian
      </footer>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/call119" element={<Call119 />} />
      <Route path="/aed" element={<AEDMap />} />
      <Route path="/hospital" element={<IncidentForm />} />
      <Route path="/etaPage" element={<EtaPage/>} />
      <Route path="/rescue/*" element={<RescuePage />} />
      <Route path="/room/*" element={<RoomMain />} />
    </Routes>
  </Router>
);

export default App;