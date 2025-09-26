import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CPRSteps: React.FC = () => {
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
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#000000' }}>
        專業版心肺復甦術 (CPR) 操作步驟
      </h1>

      {/* 切換按鈕 */}
      <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setSelectedGroup('adult')}
          style={{
            backgroundColor: selectedGroup === 'adult' ? '#D32F2F' : '#ccc',
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
            backgroundColor: selectedGroup === 'infant' ? '#F57C00' : '#ccc',
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

      {/* 👨 成人 */}
      {selectedGroup === 'adult' && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#D32F2F' }}>👨 成人急救步驟</h2>
          <ul>
            <li><strong>叫 - </strong>確認周圍環境是否安全，輕拍患者肩膀來確認有無意識。</li>
            <li><strong>叫 - </strong>打 119 報案，請求協助並取得 AED。</li>
            <li><strong>C（Compressions） - </strong>雙手交疊壓胸，速率 100~120 次/分，壓深至少 5 公分，避免中斷超過 10 秒，連續按壓 30 下。</li>
            <li><strong>A（Airway） - </strong>使用「壓額、捏鼻、抬下巴」方式打開呼吸道。</li>
            <li><strong>B（Breathing） - </strong>每 30 次胸壓後進行 2 次吹氣，每次約 1 秒，觀察胸部起伏。吹氣前捏住鼻子，嘴對嘴密合。</li>
            <li><strong>D（Defibrillation） - </strong>打開 AED，依語音圖示操作。建議電擊時確認「無人碰觸患者」。AED 每 2 分鐘分析一次 → 重複 CABD 流程，直到患者恢復或醫護人員接手。</li>
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
              marginTop: '1rem',
            }}
          >
            CPR 節拍器
          </button>
        </section>
      )}

      {/* 🧒 兒童 */}
      {selectedGroup === 'child' && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#1976D2' }}>🧒 兒童急救步驟</h2>
          <ul>
            <li><strong>叫 - </strong>拍打小朋友雙肩。</li>
            <li><strong>叫 - </strong>撥打119，並請人拿自動體外去顫器(AED)。配合119派遣員確認是否有正常呼吸。</li>
            <li><strong>C - </strong>開始胸外按壓 (Compression)。</li>
            <li><strong>A - </strong>暢通呼吸道 (Airway)。</li>
            <li><strong>B - </strong>給予兩次人工呼吸 (Breathing)。</li>
            <li><strong>D - </strong>使用 AED，並聽從語音指示。</li>
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
              marginTop: '1rem',
            }}
          >
            CPR 節拍器
          </button>
        </section>
      )}

      {/* 👶 嬰兒 */}
      {selectedGroup === 'infant' && (
        <section>
          <h2 style={{ color: '#F57C00' }}>👶 嬰兒急救步驟</h2>
          <ul>
            <li><strong>叫 - </strong>拍打嬰兒腳跟。</li>
            <li><strong>叫 - </strong>撥打119，並請人拿自動體外去顫器(AED)。配合119派遣員確認是否有正常呼吸。</li>
            <li><strong>C - </strong>開始胸外按壓 (Compression)。</li>
            <li><strong>A - </strong>暢通呼吸道 (Airway)。</li>
            <li><strong>B - </strong>給予兩次人工呼吸 (Breathing)。</li>
            <li><strong>D - </strong>使用 AED，並聽從語音指示。</li>
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
              marginTop: '1rem',
            }}
          >
            CPR 節拍器
          </button>
        </section>
      )}
    </div>
  );
};

export default CPRSteps;
