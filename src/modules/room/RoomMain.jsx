import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { createRoom, checkRoomExists } from "./roomService";
import RoomPage from "./RoomPage";
import RoomList from "./roomList";

import AEDMap from '../aed/aed-map-frontend/AEDMap';
import Call119 from "../call119/call119Page";
import IncidentForm from "../dataRecord/incidentPage";
import RescuePage from '../rescue/rescuePage';
import "./room.css";

const RoomHome = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("userId", userId);
    }
  }, []);

  const handleCreateRoom = async () => {
    const newRoomId = await createRoom();
    navigate(`/room/${newRoomId}`);
  };

  const handleJoinRoom = async () => {
    const exists = await checkRoomExists(joinCode);
    if (exists) {
      navigate(`/room/${joinCode}`);
    } else {
      alert("❌ 房間不存在！");
    }
  };

  return (
    <div>
      <h1>協作急救系統</h1>
      <button onClick={handleCreateRoom}>+ 建立新房間</button>
      <input
        type="text"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        placeholder="輸入房號"
      />
      <button onClick={handleJoinRoom}>加入房間</button>

      <RoomList onJoin={(roomId) => navigate(`/room/${roomId}`)} />
    </div>
  );
};

const RoomMain = () => {
  return (
    <Routes>
      <Route path="/" element={<RoomHome />} />
      <Route path=":roomId/*" element={<RoomPage />}>
        <Route path="aed" element={<AEDMap />} />
        <Route path="call119" element={<Call119 />} />
        <Route path="record" element={<IncidentForm />} />
        <Route path="rescue/*" element={<RescuePage />} />
      </Route>
    </Routes>
  );
};

export default RoomMain;
