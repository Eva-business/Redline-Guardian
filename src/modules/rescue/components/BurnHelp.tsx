import React from 'react';
import burn from '../images/burn.png';

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

const CitizenBurnHelp: React.FC = () => {
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
      <h1>民眾版燒燙傷急救操作步驟</h1>

      {/* 一、判斷是否為嚴重燒傷 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>📌 判斷是不是「嚴重燒燙傷」？</h2>
        <p>符合下列任一情形，請<strong>立即撥打 119</strong>：</p>
        <ul>
          <li>面積 <strong>大於一個身體區塊</strong>（如整條腿、一整個背）</li>
          <li>部位在：臉、會陰、手、腳、生殖器、關節處</li>
          <li>出現：焦黑、脫皮、水泡、<strong>無痛感</strong> 等嚴重徵象</li>
          <li>原因是：<strong>電灼傷、化學品、火焰灼傷、吸入熱氣</strong></li>
          <li><strong>小孩或長輩</strong> 燒傷面積超過掌心 <strong>5 倍以上</strong></li>
        </ul>

        
      </section>

      {/* 二、處理口訣 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>✅ 處理口訣：沖、脫、泡、蓋、送</h2>
        {/* 插圖位置 */}
        <div style={{ marginTop: '1rem' }}>
          {/* 用實際圖片網址替代下行 src */}
          <img
            src={burn}
            alt="沖脫泡蓋送 圖示"
            style={{ maxWidth: '50%', borderRadius: '8px' }}
          />
        </div>
        <h3> 1. 沖</h3>
        <ul>
          <li>立刻用<strong>冷水沖</strong>傷口，持續沖洗至少 <strong>10–30 分鐘</strong></li>
          <li><strong>不用冰塊、不用冰敷袋！</strong></li>
        </ul>

        <h3> 2. 脫</h3>
        <ul>
          <li>先將衣服<strong>泡濕</strong>，再小心剪開</li>
          <li>衣物<strong>黏住皮膚</strong>的部分不要硬拉</li>
        </ul>

        <h3>3. 泡</h3>
        <ul>
          <li><strong>小範圍</strong>傷口可以泡水減輕疼痛</li>
          <li>兒童或大面積傷口<strong>不建議泡太久</strong>，避免失溫</li>
        </ul>

        <h3>4. 蓋</h3>
        <ul>
          <li>用<strong>乾淨毛巾、紗布、保鮮膜</strong>輕輕蓋住傷口</li>
          <li><strong>不要塗抹任何東西！</strong></li>
          <li>
            ❌ 牙膏、❌ 醬油、❌ 萬金油、❌ 藥膏 → 全部<strong>都不行！</strong>
          </li>
        </ul>

        <h3>5. 送</h3>
        <ul>
          <li>儘速<strong>就醫</strong>檢查</li>
          <li>如嚴重，<strong>立即撥打 119</strong> 由消防人員協助</li>
        </ul>
      </section>

      {/* 三、影片區 */}
      <section style={{ marginTop: '2rem' }}>
        <h2>🎥 處理燒燙傷影片</h2>
        <YouTubeEmbed
          src="https://www.youtube.com/embed/HvmnFZuIvIk?start=49"
          title="處理燒燙傷教學影片"
        />
      </section>
    </div>
  );
};

export default CitizenBurnHelp;
