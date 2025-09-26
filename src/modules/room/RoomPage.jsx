import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { onRoomUpdate, joinTask, leaveTask, completeTask } from "./roomService";
import FloatingTaskPanel from "./floatingTask";
import "./RoomPage.css";

const RoomPage = () => {
  const { roomId } = useParams();
  const [tasks, setTasks] = useState({});
  const [userTasks, setUserTasks] = useState({});
  const userId = localStorage.getItem("userId") || "guest";
  const navigate = useNavigate();

  // 🔹 新增：父元件提供的跳轉函式
  const navigateToTaskPage = (taskName) => {
    navigate(`/room/${roomId}/${taskName}`);
  };

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onRoomUpdate(roomId, (data) => {
      if (!data) {
        alert("❌ 找不到房間");
        return;
      }
      setTasks(data.tasks || {});
      setUserTasks(data.userTasks || {});
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleJoin = async (taskName) => {
    const success = await joinTask(roomId, taskName, userId);
    if (!success) {
      alert("❌ 任務已滿或加入失敗，或你已選擇其他任務");
      return;
    }
  };

  const handleLeave = async (taskName) => {
    const success = await leaveTask(roomId, taskName, userId);
    if (!success) alert("❌ 離開任務失敗");
  };

  const handleComplete = async (taskName) => {
    const success = await completeTask(roomId, taskName);
    if (!success) alert("❌ 完成任務失敗");
  };

  return (
    <>
      <FloatingTaskPanel
        tasks={tasks}
        userTasks={userTasks}
        roomId={roomId}
        userId={userId}
        onJoin={handleJoin}
        onLeave={handleLeave}
        onComplete={handleComplete}
        navigateToTaskPage={navigateToTaskPage} // ✅ 傳入跳轉函式
      />
      <Outlet />
    </>
  );
};

export default RoomPage;
