import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const symptoms = [
  '無意識(昏迷)且無呼吸',
  '抓喉、臉色發紫',
  '無意識(昏迷)且有呼吸',
  '皮膚紅疹、腫脹、呼吸困難',
  '癲癇、身體抽搐',
  '出血不止',
  '熱燙傷、化學燙傷',
  '皮膚紅疹、發癢、鼻水、眼癢、喉癢',
];

const symptomPriorityMap: Record<string, number> = {
  '無意識(昏迷)且無呼吸': 1,
  '抓喉、臉色發紫': 2,
  '無意識(昏迷)且有呼吸': 3,
  '皮膚紅疹、腫脹、呼吸困難': 4,
  '癲癇、身體抽搐': 5,
  '出血不止': 6,
  '熱燙傷、化學燙傷': 7,
  '皮膚紅疹、發癢、鼻水、眼癢、喉癢': 8,
};

const routeMap: Record<string, Record<string, string>> = {
  '無意識(昏迷)且無呼吸': { no: '/CPRGuide', yes: '/CPRGuide_p' },
  '抓喉、臉色發紫': { no: '/ChokingEmergency', yes: '/ChokingEmergency_p' },
  '無意識(昏迷)且有呼吸': { no: '/ConsciousnessEmergency', yes: '/ConsciousnessEmergency_p' },
  '皮膚紅疹、腫脹、呼吸困難': { no: '/SevereAllergyHelp', yes: '/SevereAllergyHelp' },
  '癲癇、身體抽搐': { no: '/SeizureFirstAid', yes: '/SeizureFirstAid' },
  '出血不止': { no: '/BleedingControl', yes: '/BleedingControl_p' },
  '熱燙傷、化學燙傷': { no: '/BurnHelp', yes: '/BurnHelp_p' },
  '皮膚紅疹、發癢、鼻水、眼癢、喉癢': { no: '/MildAllergyHelp', yes: '/MildAllergyHelp' },
};

const experienceOptions = [
  { label: '無經驗（需詳細指導）', value: 'no' },
  { label: '有經驗（簡略指導）', value: 'yes' },
];

const SymptomSelector: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [experience, setExperience] = useState('no');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { roomId } = useParams(); // ← 拿到路由參數 roomId

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleStart = () => {
    if (selectedSymptoms.length === 0) {
      alert('請至少選擇一個症狀。');
      return;
    }

    const sorted = [...selectedSymptoms].sort(
      (a, b) => symptomPriorityMap[a] - symptomPriorityMap[b]
    );
    const mostUrgent = sorted[0];
    const route = routeMap[mostUrgent]?.[experience];

  if (route) {
    if (roomId && roomId !== "undefined") {
      // ✅ 在房間內
      navigate(`/room/${roomId}/rescue${route}`);
    } else {
      // ✅ 從首頁進入
      navigate(`/rescue${route}`);
    }
  } else {
    alert('找不到對應頁面，請確認設定。');
  }
};

// 影片檔案選擇事件
  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadResult(null);
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    } else {
      setVideoFile(null);
    }
  };

  // 影片上傳
  const uploadVideo = async () => {
    if (!videoFile) {
      alert('請先選擇一支影片');
      return;
    }

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        setUploadResult('上傳失敗：' + text);
      } else {
      const text = await res.text();
      const diagnosis = text.trim().replace(/^判斷結果：/, '');
      const aiSymptoms = diagnosis
        .split(/\s*\/\s*/) // 分割多個症狀
        .map(s => s.trim())
        .filter(s => symptoms.includes(s)); 

      setSelectedSymptoms(aiSymptoms); //自動勾選
      setUploadResult('判斷結果：' + diagnosis);
      }
    } catch (error) {
      console.error('上傳錯誤:', error);
      setUploadResult('❌ 上傳失敗，請確認後端伺服器是否有啟動');
    } finally {
      setUploading(false);
    }
  };
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '860px',
      margin: 'auto',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      color: '#333',
      lineHeight: '1.6',
      textAlign: 'left',
    }}>
      <h1>🆘 症狀選擇與急救經驗</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>📋 患者主要症狀（可多選）</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem 2rem',
          marginTop: '1rem',
        }}>
          {symptoms.map((symptom) => (
            <label key={symptom} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => toggleSymptom(symptom)}
                style={{ marginRight: '0.5rem' }}
              />
              <span>{symptom}</span>
            </label>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>🙋‍♂️ 您的急救經驗</h2>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            marginTop: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        >
          {experienceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      
      <section style={{ marginTop: '4rem' }}>
        <h2>📹 AI判斷症狀</h2>
        <h3>請上傳3~7秒的影片</h3>
        <input
          type="file"
          accept="video/*"
          onChange={onVideoChange}
          disabled={uploading}
        />
        <button
          onClick={uploadVideo}
          disabled={uploading || !videoFile}
          style={{
            padding: '0.5rem 1rem',
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? '上傳中...' : '上傳影片'}
        </button>
        {uploadResult && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f0f4ff',
              borderRadius: '6px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {uploadResult}
          </div>
        )}
      </section>

      <div style={{ marginTop: '2.5rem' }}>
        <button
          onClick={handleStart}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          🚀 開始急救指導
        </button>
      </div>
    </div>
  );
};

export default SymptomSelector;