import React, { useState } from "react";
import "./Incident.css";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase"; // 請自行設定你的 firebase 初始化

const db = getFirestore(app);
const storage = getStorage(app);

const uploadPhoto = async (file) => {
  if (!file) return null;
  const timestamp = Date.now();
  const storageRef = ref(storage, `incident_photos/${timestamp}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

export default function IncidentForm() {
  const [identity, setIdentity] = useState("none");
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const photoURL = await uploadPhoto(file);
      const collectionName =
        identity === "family" ? "familyReports" : "otherReports";

      await addDoc(collection(db, collectionName), {
        identity,
        ...formData,
        photoURL: photoURL || null,
        timestamp: Timestamp.now(),
      });

      alert("✅ 資料送出成功！");
      setIdentity("none");
      setFormData({});
      setFile(null);
    } catch (e) {
      alert("❌ 發生錯誤：" + e.message);
    }
  };

  return (
    <div className="incident-container">
      <h1>傷患資料紀錄</h1>

      <label>
        選擇身份：
        <select
          value={identity}
          onChange={(e) => {
            setIdentity(e.target.value);
            setFormData({});
          }}
        >
          <option value="none">--請選擇--</option>
          <option value="family">親友家屬</option>
          <option value="other">其他</option>
        </select>
      </label>

      {(identity === "family" || identity === "other") && (
        <form onSubmit={handleSubmit}>
          <label>
            事發時間與地點：
            <input
              type="text"
              id={`${identity === "family" ? "f" : "o"}-time-location`}
              onChange={handleInputChange}
              required
            />
          </label>

          {identity === "family" && (
            <>
              <label>
                年齡：
                <input
                  type="number"
                  id="f-age"
                  onChange={handleInputChange}
                />
              </label>

              <label>
                服用藥物：
                <textarea
                  id="f-medication"
                  onChange={handleInputChange}
                ></textarea>
              </label>
            </>
          )}

          <label>
            症狀描述：
            <textarea
              id={`${identity === "family" ? "f" : "o"}-symptoms`}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            採取措施：
            <textarea
              id={`${identity === "family" ? "f" : "o"}-action`}
              onChange={handleInputChange}
            />
          </label>

          <label>
            上傳照片：
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <label>
            備註：
            <textarea
              id={`${identity === "family" ? "f" : "o"}-notes`}
              onChange={handleInputChange}
            />
          </label>

          <button type="submit">送出紀錄</button>
        </form>
      )}
    </div>
  );
}
