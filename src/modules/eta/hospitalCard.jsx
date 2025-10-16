import './HospitalCard.css';

function HospitalCard({ hospital, onClose }) {
  if (!hospital) return null;

  const destination = encodeURIComponent(hospital["機構地址"] || hospital["機構名稱"]);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{hospital["機構名稱"]}</h2>
        <p><strong>電話：</strong>{hospital["機構電話"] || "無資料"}</p>
        <p><strong>地址：</strong>{hospital["機構地址"] || "無資料"}</p>
        <p><strong>等級：</strong>{hospital["評定等級"] || "無資料"}</p>
        <p><strong>備註：</strong>{hospital["備註"] || "無"}</p>
        <p>
          <strong>急診即時資訊：</strong>
          {hospital["急診即時資訊"] ? (
            <a href={hospital["急診即時資訊"]} target="_blank" rel="noopener noreferrer">點我前往</a>
          ) : "無資料"}
        </p>
        <p>
          <strong>導航：</strong>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">開啟 Google 導航</a>
        </p>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default HospitalCard;
