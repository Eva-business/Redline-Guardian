import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MildAllergyHelp: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams(); // ← 拿到路由參數 roomId
  
  const handleSAHClick = () => {
    if (roomId) {
      navigate(`/room/${roomId}/rescue/SevereAllergyHelp`);
    } else {
      navigate(`/rescue/SevereAllergyHelp`);
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '820px',
        margin: 'auto',
        fontFamily: '"Segoe UI", sans-serif',
        color: '#333',
        lineHeight: '1.7',
        textAlign: 'left',
      }}
    >
      <h1>輕度過敏急救操作步驟</h1>

      {/* 判斷是否為輕度症狀 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>📌 判斷是不是「輕度」過敏症狀</h2>
        <ul>
          <li>皮膚出現<strong>紅疹</strong>、<strong>發癢</strong></li>
          <li><strong>鼻水</strong>、<strong>眼睛癢</strong>、<strong>喉嚨癢</strong></li>
          <li>輕微呼吸困難（<strong>仍可說話</strong>）</li>
          <li><strong>無明顯腫脹</strong>或<strong>休克</strong>症狀</li>
        </ul>
      </section>

      {/* 幫助方法 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>🚑 幫助方法</h2>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>步驟</th>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>具體行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #ccc' }}>✅ 遠離過敏源</td>
              <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                觀察是否剛吃了食物、吸入空氣中的粉塵/動物毛等，盡快移除或轉移環境。
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #ccc' }}>✅ 鬆開衣物</td>
              <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                放鬆患者衣領、圍巾等，避免加重呼吸困難。
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #ccc' }}>✅ 舒適坐姿</td>
              <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                不建議平躺，讓患者保持坐姿、上半身稍微前傾較舒適。
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #ccc' }}>✅ 安撫情緒</td>
              <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                避免驚嚇、焦躁情緒引發惡化。
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #ccc' }}>✅ 觀察惡化跡象</td>
              <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                若患者開始出現 <strong>嘴唇發紫、說不出話、全身出疹、腫脹、喘氣困難</strong>，可能轉為嚴重過敏（<strong>Anaphylaxis</strong>）應立即叫救護車。
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 提示區 */}
      <section style={{ marginTop: '2rem', backgroundColor: '#fff8e1', padding: '1rem', borderRadius: '8px' }}>
        <strong>⚠️ 提醒：</strong>輕度過敏也可能快速惡化，<strong>持續觀察</strong>變化，並詢問患者是否有過敏藥物或自備腎上腺素筆（EpiPen）。
      </section>
      <br/>
    <button
        onClick={handleSAHClick}
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
        ⭢重度過敏急救
      </button>
      {/* 三、誘發因子與預防 */}
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
                蜜蜂、紅火蟻、胡蜂等昆蟲螫咬
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default MildAllergyHelp;
