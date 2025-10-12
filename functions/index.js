// ✅ 只給 Cloud Functions 用
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 🔒 防止重複初始化（這行很重要）
const app = getApps().length ? getApps()[0] : initializeApp();
const db = getFirestore(app);

// ✅ 每 1 小時檢查一次
export const cleanupOldRooms = onSchedule("every 60 minutes", async (event) => {
  const now = Date.now();
  const cutoff = now - 2 * 60 * 60 * 1000; // 2 小時前

  const snapshot = await db.collection("rooms").get();
  const batch = db.batch();
  let deletedCount = 0;

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
