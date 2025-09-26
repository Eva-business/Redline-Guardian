import React from 'react';
import seizure_recovery from '../images/seizure_recovery.png';

const SeizureFirstAid: React.FC = () => {
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
      <h1>癲癇急救操作步驟</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>❗不要做的事</h2>
        <ul style={{ color: '#c0392b', fontWeight: 'bold' }}>
          <li>❌ 不要試圖<strong>壓住對方身體</strong></li>
          <li>❌ 不要把<strong>東西塞進嘴巴</strong></li>
          <li>❌ 不要<strong>強行移動患者</strong></li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>🚑 正確幫助方法</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ccc' }}>步驟</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ccc' }}>具體行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem' }}>✅ 保持環境安全</td>
              <td style={{ padding: '0.75rem' }}>清除患者周圍會造成受傷的硬物（椅子、桌角等）</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>✅ 墊住頭部</td>
              <td style={{ padding: '0.75rem' }}>用衣物或外套輕墊頭部下方，避免撞傷</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>✅ 側躺頭部</td>
              <td style={{ padding: '0.75rem' }}>頭部略微側向一邊，避免嘔吐物、口水造成嗆咳</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>✅ 計時發作時間</td>
              <td style={{ padding: '0.75rem' }}>
                發作<strong>超過 5 分鐘</strong>以上需叫救護車，或<strong>首次發作</strong>也應立即叫救護車
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>✅ 發作後安撫</td>
              <td style={{ padding: '0.75rem' }}>
                發作結束時患者會混亂迷惘，<strong>安撫對方</strong>，避免自行起身走動
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <h3>癲癇動作停止後，協助患者側躺</h3>
      <img src={seizure_recovery} alt="癲癇動作停止後" style={{ width: '70%', borderRadius: '8px', marginBottom: '2rem' }} />
    </div>
  );
};

export default SeizureFirstAid;
