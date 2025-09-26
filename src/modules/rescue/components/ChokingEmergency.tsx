import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import heimlich from '../images/heimlich.jpg';
import heimlich_baby from '../images/heimlich_baby.png';
import baby_cpr from '../images/baby_cpr.png';

// ✅ 共用影片嵌入元件
const YouTubeEmbed: React.FC<{ src: string; title: string }> = ({ src, title }) => (
  <div style={{ margin: '2rem 0' }}>
    <iframe
      width="100%"
      height="400"
      src={src}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ borderRadius: '8px' }}
    ></iframe>
  </div>
);

const ChokingEmergency: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<'adult' | 'infant'>('adult');
  const { roomId } = useParams(); // ← 拿到路由參數 roomId

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
      <h1>民眾版食道堵塞急救操作步驟</h1>

      {/* 切換按鈕 */}
      <div style={{ display: 'flex', justifyContent: 'left', margin: '1.5rem 0' }}>
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
          👦 成人 / 一歲以上兒童
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
          👶 一歲以下嬰兒
        </button>
      </div>

      {/* 成人及一歲以上兒童 */}
      {selectedGroup === 'adult' && (
        <section>
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
              margin: '1rem 0',
            }}
          >
            CPR 節拍器
          </button>

          <YouTubeEmbed
            src="https://www.youtube.com/embed/9NoUfZgFY9c"
            title="哈姆立克法教學影片"
          />
          <YouTubeEmbed
            src="https://www.youtube.com/embed/RyxTDF52ctw"
            title="人工呼吸教學影片"
          />
        </section>
      )}

      {/* 嬰兒 */}
      {selectedGroup === 'infant' && (
        <section>
          <h2>👶 一歲以下嬰兒</h2>
          <ul>
            <li>撥打 119</li>
            <li>實施拍背壓胸法與胸外按壓</li>
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
              margin: '1rem 0',
            }}
          >
            CPR 節拍器
          </button>
            <br />
          <img
            src={baby_cpr}
            alt="嬰兒按壓位置"
            style={{
              width: '50%',
              borderRadius: '8px',
              marginBottom: '2rem',
            }}
          />

          <YouTubeEmbed
            src="https://www.youtube.com/embed/UM9dZrIfF1Q"
            title="嬰兒拍背壓胸 + 胸外按壓影片"
          />
          <YouTubeEmbed
            src="https://www.youtube.com/embed/RyxTDF52ctw"
            title="人工呼吸教學影片"
          />
        </section>
      )}
    </div>
  );
};

export default ChokingEmergency;
