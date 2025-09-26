import React, { useEffect, useState } from "react";
import { onRoomsUpdate } from "./roomService";

const RoomList = ({ onJoin }) => {
  const [rooms, setRooms] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const unsubscribe = onRoomsUpdate(setRooms);
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📋 目前存在的房間</h3>
      <p>目前使用者 ID: <code>{userId}</code></p>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <button onClick={() => onJoin(room.id)}>
              加入房間 #{room.roomId}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
