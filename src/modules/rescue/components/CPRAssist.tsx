import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cprguide from '../images/cpr-guide.png';

const CPRAssist: React.FC = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cprCount, setCprCount] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [notice, setNotice] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      clearInterval(timerRef.current as NodeJS.Timeout);
      audioContextRef.current?.close();
    };
  }, []);

  const playBeep = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.warn("Beep 播放失敗", e);
    }
  };

  const playAlertBeep = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 1200; // 高音
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.warn("警示音播放失敗", e);
    }
  };

  const showNotice = (message: string) => {
    setNotice(message);
    setTimeout(() => {
      setNotice(null);
    }, 5000);
  };

  const startCPR = () => {
    if (intervalRef.current) return;

    startTimeRef.current = Date.now();
    setCprCount(0);
    setTime(0);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setCprCount(prev => {
        const newCount = prev + 1;

        if (newCount % 220 === 0) {
          showNotice("⚠️ 建議更換施救者，避免疲勞");
          playAlertBeep(); //換手警示音
        } else {
          playBeep(); // 正常節奏
        }

        return newCount;
      });

      if (indicatorRef.current) {
        indicatorRef.current.classList.add("flash");
        setTimeout(() => {
          indicatorRef.current?.classList.remove("flash");
        }, 300);
      }
    }, 545); // 約 110 BPM

    timerRef.current = setInterval(() => {
      if (startTimeRef.current !== null) {
        const elapsed = Date.now() - startTimeRef.current;
        setTime(elapsed);
      }
    }, 1000);
  };

  const stopCPR = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    intervalRef.current = null;
    timerRef.current = null;
    setIsRunning(false);
  };

  const formatTime = (ms: number): string => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ✅ 新增：導向骨架辨識頁面
  const goToPosePage = () => {
    window.location.href = "/cpr_pose.html"; 
  };

  return (
    <div className="cpr-container" style={{ textAlign: "center", padding: "2rem", position: 'relative' }}>
      {/* ✅ 返回上一頁按鈕 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          backgroundColor: '#e0e0e0',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        ⬅ 返回
      </button>

      {/* ✅ 新增「骨架辨識」按鈕 */}
      <button
        onClick={goToPosePage}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: '#4CAF50',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        🔍 骨架辨識
      </button>

      {notice && (
        <div
          style={{
            position: "fixed",
            top: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff8c4",
            color: "#333",
            padding: "1rem 2rem",
            border: "1px solid #aaa",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 9999,
            fontWeight: "bold",
            animation: "fadeIn 0.3s ease"
          }}
        >
          {notice}
        </div>
      )}

      <div
        ref={indicatorRef}
        style={{
          fontSize: "3rem",
          transition: "0.2s",
        }}
      >
        ❤️
      </div>
      <h2>CPR 節拍器</h2>
      <p>100-120 BPM</p>
      <div>
        <h1>{cprCount}</h1>
        <p>壓胸次數</p>
      </div>
      <div style={{ marginTop: "1rem" }}>
        {!isRunning ? (
          <button onClick={startCPR}>▶️ 開始 CPR</button>
        ) : (
          <button onClick={stopCPR}>⏹️ 停止</button>
        )}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <h3>🕒 持續時間</h3>
        <p>{formatTime(time)}</p>
      </div>
      {/* CPR指示圖片 */}
      <img src={cprguide} alt="CPR 指南" style={{ marginTop: "2rem", maxWidth: "100%" }} />
      <style>{`
        .flash {
          color: red;
          transform: scale(1.4);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CPRAssist;
