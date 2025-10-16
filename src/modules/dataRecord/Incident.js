// Incident.js (type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// firebaseConfig 來替換 ↓
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 圖片上傳輔助函式
async function uploadPhoto(file) {
  if (!file) return null;
  const timestamp = Date.now();
  const storageRef = ref(storage, `incident_photos/${timestamp}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

// ✅ 單切換邏輯
document.getElementById("identity").addEventListener("change", function () {
  const identity = this.value;
  document.getElementById("family-form").style.display = identity === "family" ? "block" : "none";
  document.getElementById("other-form").style.display = identity === "other" ? "block" : "none";
});

// ✅ 親友家屬表單送出
document.getElementById("family-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const age = document.getElementById("f-age").value;
  const medication = document.getElementById("f-medication").value;
  const symptoms = document.getElementById("f-symptoms").value;
  const action = document.getElementById("f-action").value;
  const notes = document.getElementById("f-notes").value;
  const timeLocation = this.querySelector('input[placeholder^="例如：2025"]').value;
  const photoFile = this.querySelector('input[type="file"]').files[0];

  try {
    const photoURL = await uploadPhoto(photoFile);
    await addDoc(collection(db, "familyReports"), {
      identity: "family",
      timeLocation,
      age: Number(age),
      medication,
      symptoms,
      action,
      notes,
      photoURL: photoURL || null,
      timestamp: new Date()
    });
    alert("✅ 親友家屬資料已送出！");
    this.reset();
    document.getElementById("family-form").style.display = "none";
    document.getElementById("identity").value = "none";
  } catch (e) {
    console.error(e);
    alert("❌ 上傳失敗：" + e.message);
  }
});

// ✅ 其他人士表單送出
document.getElementById("other-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const timeLocation = document.getElementById("o-time-location").value;
  const symptoms = document.getElementById("o-symptoms").value;
  const action = document.getElementById("o-action").value;
  const notes = document.getElementById("o-notes").value;
  const photoFile = this.querySelector('input[type="file"]').files[0];

  try {
    const photoURL = await uploadPhoto(photoFile);
    await addDoc(collection(db, "otherReports"), {
      identity: "other",
      timeLocation,
      symptoms,
      action,
      notes,
      photoURL: photoURL || null,
      timestamp: new Date()
    });
    alert("✅ 不知情者資料已送出！");
    this.reset();
    document.getElementById("other-form").style.display = "none";
    document.getElementById("identity").value = "none";
  } catch (e) {
    console.error(e);
    alert("❌ 上傳失敗：" + e.message);
  }
});
