import React from 'react';
import abcImage from '../images/abc-bleeding.jpg'; // ✅ 正確引入圖片

const YouTubeEmbed = ({ src, title }) => (
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

const PublicBleedingHelp = () => {
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
      <h1>民眾版外傷出血急救操作步驟</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>📌 判斷是否「大量出血」</h2>
        <ul>
          <li><strong>「噴」</strong>：血是用噴的（動脈出血）</li>
          <li><strong>「濕」</strong>：衣服大面積被血浸濕</li>
          <li><strong>「斷」</strong>：明顯斷肢、嚴重撕裂傷</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>✅ 出血處理口訣 ABC</h2>

        <img
          src={abcImage}
          alt="出血處理口訣 ABC"
          style={{
            width: '100%',
            maxWidth: '600px',
            borderRadius: '8px',
            margin: '1rem 0',
          }}
        />

        <h3 style={{ marginTop: '1.5rem' }}>A — Alert 立即求救</h3>
        <ul>
          <li>撥打 119，說明：「有人大量出血，需要急救」</li>
          <li>清楚交代：地點、幾人受傷、是否昏迷、血量多寡</li>
        </ul>

        <h3 style={{ marginTop: '1.5rem' }}>B — Bleeding 找出血點</h3>
        <ul>
          <li>掀開衣物查看（特別注意：腋下、鼠蹊部、背部）</li>
          <li>確認出血位置、流量、有無異物</li>
        </ul>

        <h3 style={{ marginTop: '1.5rem' }}>C — Compress 加壓止血</h3>
        <ul>
          <li>找乾淨布料或紗布，<strong>直接壓在出血處</strong></li>
          <li>手掌或手指壓緊 <strong>5–10 分鐘</strong></li>
          <li>可加更多布料加壓固定</li>
          <li><strong>持續加壓不鬆手</strong>，直到救護人員到場</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>影片參考</h2>

        <YouTubeEmbed
          src="https://www.youtube.com/embed/0-nI56AnI5s?start=35"
          title="傷口止血包紮"
        />
        <YouTubeEmbed
          src="https://www.youtube.com/embed/9WCuBhA0CGQ"
          title="填塞止血"
        />
      </section>
    </div>
  );
};

export default PublicBleedingHelp;
