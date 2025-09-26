import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import heimlich from '../images/heimlich.jpg';
import heimlich_baby from '../images/heimlich_baby.png';

const ChokingEmergency: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<'adult' | 'infant'>('adult');
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
      <h1>專業版食道堵塞操作步驟</h1>

      {/* 切換按鈕 */}
      <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '1.5rem', marginTop: '1rem' }}>
        <button
          onClick={() => setSelectedGroup('adult')}
          style={{
            backgroundColor: selectedGroup === 'adult' ? '#1976D2' : '#ccc',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '1rem',
          }}
        >
          👨 成人 / 兒童（1 歲以上）
        </button>
        <button
          onClick={() => setSelectedGroup('infant')}
          style={{
            backgroundColor: selectedGroup === 'infant' ? '#F57C00' : '#ccc',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          👶 嬰兒（1 歲以下）
        </button>
      </div>

      {/* 👨 成人 / 兒童 */}
      {selectedGroup === 'adult' && (
        <>
          <section style={{ marginTop: '2rem' }}>
            <h2>👦 成人及一歲以上兒童</h2>

            <h3>🔹 輕度噎住（能咳）</h3>
            <ul>
              <li>鼓勵持續咳嗽</li>
              <li>❌ <strong>不要拍背</strong>，避免異物移動導致窒息</li>
            </ul>

            <h3>🔹 重度噎住（不能咳）</h3>
            <ul>
              <li>撥打 119</li>
              <li>採取穩固站姿（站在病患後方，一腳前一腳後）</li>
              <li>一手握拳，拳頭放在肚臍上方，另一手包住拳頭</li>
              <li>向內上方<strong>快速壓迫</strong>（哈姆立克法 Heimlich maneuver）</li>
              <li>重複推壓，直到異物排出或病人昏倒</li>
              <li>若失去意識，立即進行 CPR + 人工呼吸</li>
              <li>每次 30 次胸外按壓後，檢查口腔異物，並給予 2 次人工呼吸</li>
            </ul>

            <div style={{ marginTop: '1.5rem' }}>
              <img
                src={heimlich}
                alt="哈姆立克法圖解"
                style={{
                  width: '50%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              />
            </div>

            <button
              onClick={handleCPRClick}
              style={{
                backgroundColor: '#1976D2',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '1.5rem',
              }}
            >
              CPR 節拍器
            </button>
          </section>
        </>
      )}

      {/* 👶 嬰兒 */}
      {selectedGroup === 'infant' && (
        <>
          <section style={{ marginTop: '2rem' }}>
            <h2>👶 一歲以下嬰兒</h2>
            <ul>
              <li>撥打 119</li>
              <li>實施拍背壓胸法與胸外按壓（嬰兒專用方式）</li>
              <li>
                若異物未排出且嬰兒失去意識，立即進行嬰兒 CPR + 人工呼吸：
                <ul>
                  <li>每次 30 次胸外按壓後檢查口腔是否有異物</li>
                  <li>給予 2 次人工呼吸</li>
                </ul>
              </li>
            </ul>

            <div style={{ marginTop: '1.5rem' }}>
              <img
                src={heimlich_baby}
                alt="嬰兒哈姆立克法圖解"
                style={{
                  width: '70%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              />
            </div>

            <button
              onClick={handleCPRClick}
              style={{
                backgroundColor: '#1976D2',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '1.5rem',
              }}
            >
              CPR 節拍器
            </button>
          </section>
        </>
      )}
    </div>
  );
};

export default ChokingEmergency;
