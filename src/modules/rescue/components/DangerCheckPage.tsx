import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const dangerOptions = [
  '現場在馬路中間或來車頻繁',
  '周圍有倒塌電線或積水',
  '現場冒煙、有火、有異味',
  '有可疑藥劑、化學品灑落',
  '建築傾斜或有倒塌風險',
  '位於海邊 / 河邊 / 暴雨淹水區',
  '現場仍有爭執或攻擊風險',
];

const DangerCheckPage: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams(); // ← 拿到路由參數 roomId

  const toggleDanger = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleConfirmSafety = () => {
    if (selectedOptions.length > 0) {
      setShowWarning(true);
    } else if (roomId !== undefined) {
      navigate(`/room/${roomId}/rescue/symptom-selector`);
    } else {
      navigate(`/rescue/symptom-selector`);
    }
  };

  const handleReport = () => {
    alert('📞 已模擬通報 119');
  };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '860px',
        margin: 'auto',
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        color: '#333',
        lineHeight: '1.6',
        textAlign: 'left',
      }}
    >
      <h1>🛑 排除環境危險因素</h1>
      <p style={{ marginTop: '0.75rem' }}>
        請先確認現場是否安全，避免讓自己陷入危險。
      </p>

      <section style={{ marginTop: '2rem' }}>
        <h2>⚠️ 危險情況（若無直接點選下一步）</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem 2rem',
            marginTop: '1rem',
          }}
        >
          {dangerOptions.map((option) => (
            <label key={option} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => toggleDanger(option)}
                style={{ marginRight: '0.5rem' }}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </section>

      <div style={{ marginTop: '2.5rem' }}>
        <button
          onClick={handleConfirmSafety}
          style={{
            backgroundColor: '#0749d8ff',
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
          下一步
        </button>
      </div>

      {showWarning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              textAlign: 'center',
              border: '2px solid #dc2626',
            }}
          >
            {/* ❌ 關閉按鈕 */}
            <button
              onClick={() => setShowWarning(false)}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: '#000000',
              }}
              aria-label="Close warning"
            >
              ×
            </button>
            <h3 style={{ color: '#dc2626', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              ⚠️ 高風險環境警告
            </h3>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              🚫 此為高風險環境，請勿貿然接近現場。
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              🔔 建議您立即通報 119 或警方，由專業人員處理。
            </p>

            <button
              onClick={handleReport}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              📞 立即通報
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerCheckPage;
