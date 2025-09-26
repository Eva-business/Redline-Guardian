import React from 'react';

const BleedingControl: React.FC = () => {
  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '860px',
        margin: 'auto',
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        color: '#333',
        textAlign: 'left',
        lineHeight: '1.6',
      }}
    >
      <h1>專業版外傷出血急救操作步驟</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#c0392b' }}>1. 加壓止血（最優先）</h2>
        <ul>
          <li>使用無菌紗布或乾淨布料直接覆蓋傷口，<strong>穩定持續加壓 5–10 分鐘</strong></li>
          <li>若血仍持續流出，<strong>不可移除原布料</strong>，應再加新紗布持續壓迫</li>
          <li>勿查看傷口，避免破壞初步血塊</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#e67e22' }}>2. 抬高患肢（無骨折時）</h2>
        <ul>
          <li>抬高傷肢高於心臟，減緩血流（可用包包、衣物墊高）</li>
          <li><strong>骨折或肢體變形時</strong>請勿強行抬高，避免惡化</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#f1c40f' }}>3. 壓迫止血點（動脈出血）</h2>
        <p>使用手指或手掌壓迫以下對應位置：</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9f9' }}>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc' }}>出血部位</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc' }}>壓迫位置</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid #ccc' }}>動脈名稱</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem' }}>上臂</td>
              <td style={{ padding: '0.75rem' }}>上臂內側</td>
              <td style={{ padding: '0.75rem' }}>肱動脈</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>手腕</td>
              <td style={{ padding: '0.75rem' }}>橈側腕部</td>
              <td style={{ padding: '0.75rem' }}>橈動脈</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>腿部</td>
              <td style={{ padding: '0.75rem' }}>腹股溝中</td>
              <td style={{ padding: '0.75rem' }}>股動脈</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>膝後</td>
              <td style={{ padding: '0.75rem' }}>膝窩</td>
              <td style={{ padding: '0.75rem' }}>膕動脈</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: '1rem' }}><strong>壓迫建議時間：5–10 分鐘內，不可超過 15 分鐘</strong></p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#27ae60' }}>4. 止血帶（大量出血）</h2>
        <ul>
          <li>僅用於四肢 <strong>動脈大出血</strong>，其他方法無效時才使用</li>
          <li>綁在傷口上方 5 公分處，綁兩圈、打半結、加入止血棒、旋轉至止血</li>
          <li><strong>標示啟用時間</strong>，避免壓迫過久造成組織壞死</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>⚠️ 特殊情況處理</h2>

        <h3 style={{ marginTop: '1rem' }}>📌 異物插入傷口</h3>
        <ul>
          <li><strong>絕對不要拔除</strong>插入物（如鐵釘、玻璃等）</li>
          <li>使用紗布環狀固定異物，<strong>避免搖晃與移動</strong></li>
          <li>可用剪孔敷料避開異物，同樣達到固定目的</li>
        </ul>

        <h3 style={{ marginTop: '1.5rem' }}>📌 清洗傷口</h3>
        <ul>
          <li>僅在 <strong>非大量出血、無異物</strong>時，可用乾淨水流清潔</li>
          <li><strong>禁止使用</strong>：酒精、優碘、海水、飲料等刺激性液體</li>
        </ul>
      </section>
      <h2>🎥 影片參考</h2>

        <YouTubeEmbed
          src="https://www.youtube.com/embed/0-nI56AnI5s?start=35"
          title="傷口止血包紮"
        />
        <YouTubeEmbed
          src="https://www.youtube.com/embed/9WCuBhA0CGQ"
          title="填塞止血"
        />
        <YouTubeEmbed
          src="https://www.youtube.com/embed/nXIgZqtc3eU"
          title="止血帶止血"
        />
    </div>
  );
};
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
export default BleedingControl;
