import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cpr_main from '../images/cpr_main.png';
import adult_step1 from '../images/adult_step1.jpg';
import adult_step2 from '../images/adult_step2.jpg';
import cprguide from '../images/cpr-guide.png';
import baby_cpr from '../images/baby_cpr.png';

const CPRGuide: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<'adult' | 'child' | 'infant'>('adult');
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
      <h1 style={{ textAlign: 'center', color: '#000000ff', marginBottom: '2rem' }}>
        民眾版心肺復甦術 (CPR) 操作步驟
      </h1>
      <img
        src={cpr_main}
        alt="CPR總覽圖"
        style={{ width: '80%', borderRadius: '8px', marginBottom: '2rem' }}
      />
      <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '1.5rem' }}>
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
          👨 成人
        </button>
        <button
          onClick={() => setSelectedGroup('child')}
          style={{
            backgroundColor: selectedGroup === 'child' ? '#1976D2' : '#ccc',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '1rem',
          }}
        >
          🧒 兒童
        </button>
        <button
          onClick={() => setSelectedGroup('infant')}
          style={{
            backgroundColor: selectedGroup === 'infant' ? '#1976D2' : '#ccc',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          👶 嬰兒
        </button>
      </div>

      {/* 成人急救步驟 */}
      {selectedGroup === 'adult' && (
        <section>
          <h2 style={{ color: '#ff0303ff' }}>👨 成人急救步驟</h2>

          <h3>1. 叫 — 評估意識、呼吸</h3>
          <p>輕拍患者肩膀來確認患者有無意識。</p>
          <img src={adult_step1} alt="評估意識" style={{ width: '30%', borderRadius: '8px', marginBottom: '2rem' }} />

          <h3>2. 叫 — 呼叫求援</h3>
          <p>打119報案，請求協助及取得AED。</p>
          <img src={adult_step2} alt="呼叫求援" style={{ width: '30%', borderRadius: '8px', marginBottom: '2rem' }} />

          <h3>3. 壓 — 胸外按壓</h3>
          <ul>
            <li>✅ 快快壓（每分鐘100~120下）</li>
            <li>✅ 用力壓（按壓深度5~6公分）</li>
            <li>✅ 胸回彈（按壓後胸部需完全回彈）</li>
            <li>✅ 莫中斷（中斷時間不得超過10秒）</li>
          </ul>
          <button
            onClick={handleCPRClick}
            style={{
              backgroundColor: '#1976D2',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            CPR 節拍器
          </button>
          <img src={cprguide} alt="胸外按壓" style={{ width: '50%', borderRadius: '8px', marginBottom: '2rem' }} />

          <h3>4. 電 — 使用 AED</h3>
          <p><strong>AED使用口訣：</strong></p>
          <ul>
            <li>開 - 打開 AED 電源</li>
            <li>貼 - 貼上電擊貼片（裸胸）</li>
            <li>插 - 插上電極</li>
            <li>電 - 依語音指示按下電擊鍵（確保無人接觸病患）</li>
          </ul>
          <p>
            AED 會每兩分鐘自動分析一次心律，電擊後立即回到壓胸，不須移除貼片。持續到醫護人員接手。
          </p>
          <YouTubeEmbed src="https://www.youtube.com/embed/pUKy2t5D1E4" title="成人CPR+AED教學" />
          <YouTubeEmbed src="https://www.youtube.com/embed/BPdceis2vmg?start=84" title="AED貼法" />
        </section>
      )}

      {/* 兒童急救步驟 */}
      {selectedGroup === 'child' && (
        <section>
          <h2 style={{ color: '#1976D2' }}>🧒 兒童急救步驟</h2>
          <ul>
            <li>叫 - 拍打小朋友雙肩</li>
            <li>叫 - 撥打119，請人拿AED，並與派遣員確認呼吸</li>
            <li>C - 胸外按壓 (Compression)</li>
            <ul>
              <li>✅ 快快壓（每分鐘100~120下）</li>
              <li>✅ 用力壓（按壓深度5公分）</li>
              <li>✅ 胸回彈（按壓後胸部需完全回彈）</li>
              <li>✅ 莫中斷（中斷時間不得超過10秒）</li>
            </ul>
            <button
            onClick={handleCPRClick}
            style={{
              backgroundColor: '#1976D2',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            CPR 節拍器
          </button>
          <img src={cprguide} alt="胸外按壓" style={{ width: '50%', borderRadius: '8px', marginBottom: '2rem' }} />
            <li>A - 暢通呼吸道 (Airway)</li>
            <li>B - 兩次人工呼吸 (Breathing)</li>
            <li>D - 使用 AED，聽從語音指示</li>
            <p><strong>AED使用口訣：</strong></p>
            <ul>
              <li>開 - 打開 AED 電源</li>
              <li>貼 - 貼上電擊貼片（裸胸）</li>
              <li>插 - 插上電極</li>
              <li>電 - 依語音指示按下電擊鍵（確保無人接觸病患）</li>
            </ul>
            <p>
              AED 會每兩分鐘自動分析一次心律，電擊後立即回到壓胸，不須移除貼片。持續到醫護人員接手。
            </p>
          </ul>
          <YouTubeEmbed src="https://www.youtube.com/embed/BPdceis2vmg?start=84" title="AED貼法" />
          <YouTubeEmbed src="https://www.youtube.com/embed/M8a2w6T8D1U?start=257" title="兒童CPR教學" />
        </section>
      )}

      {/* 嬰兒急救步驟 */}
      {selectedGroup === 'infant' && (
        <section>
          <h2 style={{ color: '#F57C00' }}>👶 嬰兒急救步驟</h2>
          <ul>
            <li>叫 - 拍打嬰兒腳跟</li>
            <li>叫 - 撥打119，請人拿AED，並與派遣員確認呼吸</li>
            <li>C - 胸外按壓 (Compression)</li>
            <ul>
              <li>✅ 快快壓（每分鐘100~120下）</li>
              <li>✅ 用力壓（按壓深度4公分）</li>
              <li>✅ 胸回彈（按壓後胸部需完全回彈）</li>
              <li>✅ 莫中斷（中斷時間不得超過10秒）</li>
            </ul>
            <button
            onClick={handleCPRClick}
            style={{
              backgroundColor: '#1976D2',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            CPR 節拍器
          </button>
          <img src={baby_cpr} alt="嬰兒按壓位置" style={{ width: '50%', borderRadius: '8px', marginBottom: '2rem' }} />
            <li>A - 暢通呼吸道 (Airway)</li>
            <li>B - 兩次人工呼吸 (Breathing)</li>
            <li>D - 使用 AED，聽從語音指示</li>
            <p><strong>AED使用口訣：</strong></p>
            <ul>
              <li>開 - 打開 AED 電源</li>
              <li>貼 - 貼上電擊貼片（裸胸）</li>
              <li>插 - 插上電極</li>
              <li>電 - 依語音指示按下電擊鍵（確保無人接觸病患）</li>
            </ul>
            <p>
              AED 會每兩分鐘自動分析一次心律，電擊後立即回到壓胸，不須移除貼片。持續到醫護人員接手。
            </p>
          </ul>
          <YouTubeEmbed src="https://www.youtube.com/embed/BPdceis2vmg?start=84" title="AED貼法" />
          <YouTubeEmbed src="https://www.youtube.com/embed/k7nOohbsxNI?start=206" title="嬰兒CPR教學" />
        </section>
      )}
    </div>
  );
};

// 共用影片嵌入元件
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

export default CPRGuide;
