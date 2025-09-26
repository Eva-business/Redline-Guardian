import React from 'react';
import Allergy from '../images/Allergy.jpg';
const SevereAllergyHelp: React.FC = () => {
  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '860px',
        margin: 'auto',
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        color: '#333',
        lineHeight: '1.7',
        textAlign: 'left',
      }}
    >
      <h1>重度過敏（過敏性休克）操作步驟</h1>

      {/* 一、判斷是否為重度過敏 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>📌 判斷是不是「重度」症狀</h2>
        <ul>
          <li>皮膚搔癢、紅疹</li>
          <li>呼吸困難、喉嚨緊縮感</li>
          <li>鼻塞、吸不到氣、喘鳴聲</li>
          <li>頭暈、冒冷汗、眼前發黑</li>
          <li>意識模糊、無力、站不穩甚至昏倒</li>
        </ul>
      </section>

      {/* 二、急救 3 步驟 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>✅ 處置步驟</h2>
        <ol>
          <li><strong>立即躺平</strong>，避免站立或坐起，以防血壓驟降引發昏厥。</li>
          <li><strong>撥打 119</strong>，清楚說明「懷疑過敏性休克」，提供位置與病情。</li>
          <li>
            <strong>立即注射腎上腺素</strong>（如攜帶 EpiPen 且熟悉使用）：
            <ul>
              <li>可緩解喉頭水腫、支氣管收縮與低血壓</li>
              <li>發揮效果約 10–15 分鐘</li>
              <li><strong>注射後無論是否改善症狀，一律送醫觀察</strong></li>
            </ul>
          </li>
        </ol>
      </section>

      {/* 三、示意圖占位符 */}
      <section style={{ marginTop: '2rem' }}>
        <img
          src={Allergy}
          alt="操作示意圖"
          style={{ width: '70%', maxWidth: '600px', borderRadius: '8px', margin: '1rem 0' }}
        />
        
      </section>

      {/* 四、誘發因子表 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>🧪 誘發因子與預防建議</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9f9' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>類型</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>常見來源</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>食物</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                蝦、蟹、海鮮、花生、牛奶、蛋、奇異果、鳳梨蝦球等
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>藥物</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                抗生素、止痛藥（例如 NSAIDs 類）
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>昆蟲毒液</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                蜜蜂、紅火蟻、胡蜂等昆蟲叮咬
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default SevereAllergyHelp;
