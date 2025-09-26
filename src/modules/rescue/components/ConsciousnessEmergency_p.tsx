import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import recovery_position from '../images/recovery_position.png';

const ConsciousnessEmergency: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams(); // ← 拿到路由參數 roomId

      // ✅ 跳轉 CPR 頁面，先檢查是否有 roomId
  const handleCPRClick = () => {
    if (roomId) {
      navigate(`/room/${roomId}/rescue/CPRAssist`);
    } else {
      navigate(`/rescue/CPRAssist`);
    }
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
      <h1 style={{ marginBottom: '1rem' }}>專業版意識問題急救操作步驟</h1>

      <section>
        <h2 style={{ fontSize: '1.25rem' }}>🚨 初步步驟</h2>
        <ul>
          <li>叫 - 拍打病患雙肩。</li>
          <li>叫 - 撥打119，並請人拿自動體外去顫器 (AED)，確認傷患是否有正常呼吸。</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem' }}>💤 操作復甦姿勢（適用於無外傷患者）</h2>
        <ol>
          <li><strong>患者側躺：</strong>將患者翻轉到離施救者較近的一側，呈側臥姿勢。</li>
          <li><strong>手臂固定：</strong>將靠近施救者的手臂向上彎曲，手掌放在頭部下方，類似抱頭的姿勢。</li>
          <li><strong>腿部固定：</strong>將患者對側的腿抬起，並與靠近施救者一側的腿交叉，固定身體。</li>
          <li><strong>保持呼吸道暢通：</strong>頭略微後仰、下巴抬起，使呼吸道暢通，方便口鼻分泌物流出。</li>
        </ol>
        <p>✅ 持續評估呼吸。</p>
      </section>

      {/* 插入復甦姿勢圖片 */}
      <div style={{ marginTop: '2rem' }}>
        <img
          src={recovery_position}
          alt="復甦姿勢圖示"
          style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        />
      </div>
      <button
        onClick={handleCPRClick}
        style={{
          backgroundColor: '#d21919ff',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        ⭢ 無呼吸急救步驟
      </button>
    </div>
  );
};

export default ConsciousnessEmergency;
