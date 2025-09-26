import React from 'react';
import burn_intro from '../images/burn_intro.jpg';

const ProfessionalBurnHelp: React.FC = () => {
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
      <h1>專業版燒燙傷急救操作步驟</h1>

      {/* 一、辨識灼傷深度 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>📌 辨識灼傷深度（Burn Depth）</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>等級</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>特徵</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>處理重點</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>一度</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>表皮紅腫、疼痛、乾燥，無水泡</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>冷敷止痛，保持清潔</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>二度（淺）</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>水泡、紅腫、劇痛、滲液</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>清創、傷口保濕照護</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>二度（深）</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>水泡破、滲液重、皮膚蒼白</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>需專科評估、可能清創或植皮</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>三度</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>皮膚焦黑、蠟白、無痛感</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>必須植皮，感染控制</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>四度</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>延伸至肌肉/骨骼，深層壞死</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>緊急手術與全身性照護</td>
            </tr>
          </tbody>
        </table>
      </section>
      <img
          src={burn_intro}
          alt="出血處理口訣 ABC"
          style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', margin: '1rem 0' }}
        />
      {/* 二、處理步驟「沖脫泡蓋送」 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>🚑 傷口處理步驟：「沖脫泡蓋送」</h2>
        <h3>1. 沖</h3>
        <ul>
          <li>使用乾淨冷水沖洗 20–30 分鐘</li>
          <li>避免使用冰塊直接接觸，避免組織傷害</li>
          <li>避免低體溫，勿全身泡水（特別是小孩/大面積）</li>
        </ul>

        <h3>2. 脫</h3>
        <ul>
          <li>邊沖邊小心剪開衣物</li>
          <li>衣物黏住皮膚時保留不動，勿強行拉扯</li>
        </ul>

        <h3>3. 泡</h3>
        <ul>
          <li>冷水泡不超過 30 分鐘（非大面積傷）</li>
          <li>可舒緩疼痛、抑制發炎</li>
        </ul>

        <h3>4. 蓋</h3>
        <ul>
          <li>以無菌紗布或保鮮膜覆蓋</li>
          <li>不可塗抹偏方（如牙膏、醬油等）</li>
        </ul>

        <h3>5. 送</h3>
        <ul>
          <li>送往整形外科/燒傷中心</li>
          <li>優先轉院情況：臉部、會陰、四肢、大面積、化學/電灼</li>
        </ul>
      </section>

      {/* 三、特殊處理 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>⚠️ 特殊灼傷補充處理</h2>

        <h3>電灼傷</h3>
        <ul>
          <li>傷口外觀小但深層嚴重</li>
          <li>密切觀察心律、肌肉壞死，務必送醫</li>
        </ul>

        <h3>化學灼傷</h3>
        <ul>
          <li>大量清水沖洗至少 30 分鐘</li>
          <li>不可進行「中和」處理</li>
          <li>保留原始容器供醫護辨識</li>
        </ul>

        <h3>火焰灼傷（Stop, Drop & Roll）</h3>
        <ul>
          <li>停止 → 臥倒 → 滾動 → 熄火</li>
          <li>後續按熱液處理原則處理</li>
        </ul>
      </section>

    </div>
  );
};

export default ProfessionalBurnHelp;
