import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './DangerCheckPage.css'; // ← 新增的樣式匯入！

const dangerOptions = [
  '現場在馬路中間或來車頻繁',
  '周圍有倒塌電線或積水',
  '現場冒煙、有火、有異味',
  '有可疑藥劑、化學品灑落',
  '建築傾斜或有倒塌風險',
  '位於海邊 / 河邊 / 暴雨淹水區',
  '現場仍有爭執或攻擊風險',
];

const DangerCheckPage = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const toggleDanger = (option) => {
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
    <div className="danger-page">
      <h1>排除環境危險因素</h1>
      <p>請先確認現場是否安全，避免讓自己陷入危險。</p>

      <section>
        <h2>⚠️ 危險情況（若無直接點選下一步）</h2>
        <div className="danger-options">
            {dangerOptions.map((option) => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => toggleDanger(option)}
                />
                <span className="custom-checkbox"></span>
                <span className="checkbox-text">{option}</span>
              </label>
            ))}
          </div>
      </section>

      <button className="next-btn" onClick={handleConfirmSafety}>
        下一步
      </button>

      {showWarning && (
        <div className="warning-modal">
          <div className="warning-card">
            <button
              className="close-btn"
              onClick={() => setShowWarning(false)}
              aria-label="Close warning"
            >
              ×
            </button>
            <h3>高風險環境警告</h3>
            <p>此為高風險環境，請勿貿然接近現場。</p>
            <p>建議您立即通報 119 或警方，由專業人員處理。</p>
            <button className="report-btn" onClick={handleReport}>
              📞 立即通報
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerCheckPage;
