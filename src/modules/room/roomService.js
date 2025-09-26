import { db } from "/src/firebase";
import {
  collection,
  setDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";

// 建立房間（3碼）
export async function createRoom() {
  const roomId = Math.floor(100 + Math.random() * 900).toString();
  const roomRef = doc(db, "rooms", roomId);
  const snap = await getDoc(roomRef);
  if (snap.exists()) return createRoom(); // 遞迴避免重複

  await setDoc(roomRef, {
    roomId,
    createdAt: new Date(),
    tasks: {
      call119: { max: 1, users: [], completed: false, completedAt: null },
      rescue: { max: null, users: [], completed: false, completedAt: null },
      aed: { max: 2, users: [], completed: false, completedAt: null },
      record: { max: 1, users: [], completed: false, completedAt: null },
    },
    userTasks: {} // 用來記錄 userId 對應任務名稱
  });

  return roomId;
}

// 檢查房間是否存在
export async function checkRoomExists(roomId) {
  const roomRef = doc(db, "rooms", roomId);
  const snap = await getDoc(roomRef);
  return snap.exists();
}

// 監聽單一房間
export function onRoomUpdate(roomId, callback) {
  const roomRef = doc(db, "rooms", roomId);
  return onSnapshot(roomRef, (snap) => {
    if (snap.exists()) callback(snap.data());
    else callback(null);
  });
}

// 監聽所有房間
export function onRoomsUpdate(callback) {
  const roomsRef = collection(db, "rooms");
  return onSnapshot(roomsRef, (snapshot) => {
    const rooms = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(rooms);
  });
}

// 加入任務（單一任務限制 + 紀錄時間）
export async function joinTask(roomId, taskName, userId) {
  const roomRef = doc(db, "rooms", roomId);
  const now = new Date().toISOString();

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(roomRef);
      if (!snap.exists()) throw new Error("Room not found");
      const data = snap.data();
      const task = data.tasks[taskName];
      if (!task) throw new Error("Task not found");

      // 檢查是否已選其他任務
      const currentTask = data.userTasks?.[userId];
      if (currentTask && currentTask !== taskName) {
        const currentTaskData = data.tasks[currentTask];
        const isCompleted = currentTaskData?.completed;

        // 如果原任務還沒完成，就不能加入其他任務
        if (!isCompleted) {
          throw new Error("只能選擇一項任務");
        }
      }

      // 檢查人數上限
      if (task.max !== null && task.users.length >= task.max)
        throw new Error("Task full");

      // 更新 users 與 userTasks
      transaction.update(roomRef, {
        [`tasks.${taskName}.users`]: [...task.users, { id: userId, time: now }],
        [`userTasks.${userId}`]: taskName,
      });
    });

    return true;
  } catch (err) {
    console.error("joinTask failed:", err);
    return false;
  }
}

// 離開任務
export async function leaveTask(roomId, taskName, userId) {
  const roomRef = doc(db, "rooms", roomId);

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(roomRef);
      if (!snap.exists()) throw new Error("Room not found");
      const data = snap.data();
      const task = data.tasks[taskName];
      if (!task) throw new Error("Task not found");

      const updatedUsers = task.users.filter((u) => u.id !== userId);

      // 移除使用者與清除完成狀態
      transaction.update(roomRef, {
        [`tasks.${taskName}.users`]: updatedUsers,
        [`tasks.${taskName}.completed`]: false,
        [`tasks.${taskName}.completedAt`]: null,
        [`userTasks.${userId}`]: null,
      });
    });

    return true;
  } catch (err) {
    console.error("leaveTask failed:", err);
    return false;
  }
}

// 任務完成
export async function completeTask(roomId, taskName) {
  const roomRef = doc(db, "rooms", roomId);
  const completedAt = new Date().toISOString();

  try {
    const snap = await getDoc(roomRef);
    const data = snap.data();
    const task = data.tasks[taskName];
    const userIds = task.users.map((u) => u.id);
    const updates = {
      [`tasks.${taskName}.completed`]: true,
      [`tasks.${taskName}.completedAt`]: completedAt,
    };

    // 將所有 userTasks 中已完成任務的人解除綁定
    userIds.forEach((uid) => {
      updates[`userTasks.${uid}`] = null;
    });

    await updateDoc(roomRef, updates);

    return true;
  } catch (err) {
    console.error("completeTask failed:", err);
    return false;
  }
}
