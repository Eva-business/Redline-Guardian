// ✅ ESM 寫法 for Node.js 20+ / Firebase v12+
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 初始化 Firebase Admin
const app = initializeApp();
const db = getFirestore(app);

// ✅ 每 1 小時檢查一次
export const cleanupOldRooms = onSchedule("every 60 minutes", async (event) => {
  const now = Date.now();
  const cutoff = now - 2 * 60 * 60 * 1000; // 2 小時前

  const snapshot = await db.collection("rooms").get();

  let deletedCount = 0;
  const batch = db.batch();

  snapshot.forEach((doc) => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate?.() || data.createdAt;

    if (createdAt && new Date(createdAt).getTime() < cutoff) {
      batch.delete(doc.ref);
      deletedCount++;
    }
  });

  if (deletedCount > 0) {
    await batch.commit();
    console.log(`🧹 已刪除 ${deletedCount} 個過期房間`);
  } else {
    console.log("✅ 沒有過期房間需要刪除");
  }
});
