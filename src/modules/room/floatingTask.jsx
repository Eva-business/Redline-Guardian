import React, { useEffect, useState } from "react";

const labelMap = {
  call119: "撥打119",
  rescue: "現場急救",
  aed: "取得AED",
  record: "救援記錄",
};

const FloatingTaskPanel = ({
  tasks,
  userTasks,
  roomId,
  userId,
  onJoin,
  onLeave,
  onComplete,
  navigateToTaskPage, // 新增：跳轉頁面函式
}) => {
  const [open, setOpen] = useState(true); // ✅ 預設為展開

  // ✅ 自動收起功能：當使用者加入任務後自動收起浮窗
  const handleJoin = async (taskName) => {
    await onJoin(taskName); // 執行原本的 onJoin
    setOpen(false);         // 自動收起浮窗
    navigateToTaskPage(taskName); // ✅ 跳轉任務頁面（須由父元件傳入函式）
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ccc",
        zIndex: 1000,
        padding: "8px 20px",
      }}
    >
      <div
        style={{ cursor: "pointer", fontWeight: "bold" }}
        onClick={() => setOpen(!open)}
      >
        📋 任務列表 {open ? "▲" : "▼"}
      </div>

      {open && (
        <div>
          <p>🧩 房間號碼：#{roomId}</p>
          <ul>
            {Object.entries(tasks).map(([taskName, task]) => {
              const userCount = task?.users?.length || 0;
              const isFull = task.max !== null && userCount >= task.max;
              const joined = task.users?.some((u) => u.id === userId);
              const completed = task.completed;

              return (
                <li key={taskName} style={{ marginBottom: "10px" }}>
                  <strong>{labelMap[taskName]}</strong>
                  （{userCount}
                  {task.max ? `/${task.max}` : " "}）
                  {completed ? (
                    <span style={{ color: "green", marginLeft: "10px" }}>
                      ✅ 已完成（
                      {new Date(task.completedAt).toLocaleTimeString()}）
                    </span>
                  ) : joined ? (
                    <>
                      <button onClick={() => onLeave(taskName)} style={{ marginLeft: "10px" }}>
                        離開
                      </button>
                      <button onClick={() => onComplete(taskName)} style={{ marginLeft: "10px" }}>
                        完成
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleJoin(taskName)}
                      disabled={isFull || userTasks[userId]}
                      style={{ marginLeft: "10px" }}
                    >
                      加入
                    </button>
                  )}

                  <ul style={{ marginLeft: "20px", fontSize: "0.9em" }}>
                    {task.users?.map((u) => (
                      <li key={u.id}>
                        👤 {u.id}（加入於 {new Date(u.time).toLocaleTimeString()}）
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FloatingTaskPanel;
