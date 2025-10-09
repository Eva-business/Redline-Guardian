import React, { useEffect, useRef, useState } from "react";
import styles from "./CprPose.module.css";
import { Camera } from "@mediapipe/camera_utils";

const VOICE_COOLDOWN = 2600; // 2.6秒

const CprPose = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const demoVideoRef = useRef(null);
  const demoCanvasRef = useRef(null);

  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const voiceSounds = useRef({});
  const lastVoiceTime = useRef(0);
  const cameraRef = useRef(null);
  const currentFacing = useRef("user");

  // ====== 初始化聲音 ======
  useEffect(() => {
    voiceSounds.current = {
      elbow: new Audio("/radio/elbow.mp3"),
      hands: new Audio("/radio/hands.mp3"),
      wrist: new Audio("/radio/wrist.mp3"),
      slow: new Audio("/radio/slow.mp3"),
      quick: new Audio("/radio/quick.mp3"),
      deep: new Audio("/radio/deep.mp3"),
    };
  }, []);

  const playVoiceAlert = (type) => {
    if (!voiceEnabled) return;
    const now = Date.now();
    if (now - lastVoiceTime.current < VOICE_COOLDOWN) return;
    if (voiceSounds.current[type]) {
      voiceSounds.current[type].currentTime = 0;
      voiceSounds.current[type].play();
      lastVoiceTime.current = now;
    }
  };

  // ====== Pose 偵測初始化 ======
  const setupPose = (videoEl, canvasEl, poseInstance, pressPathName, pressTimestampsName, pressStartTimeName) => {
    const ctx = canvasEl.getContext("2d");

    const resizeCanvas = () => {
      if (videoEl.videoWidth && videoEl.videoHeight) {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
      }
    };

    videoEl.addEventListener("loadedmetadata", resizeCanvas);
    window.addEventListener("resize", resizeCanvas);

    const midpoint = (p1, p2) => ({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });
    const calcAngle = (a, b, c) => {
      const ab = [b.x - a.x, b.y - a.y];
      const cb = [b.x - c.x, b.y - c.y];
      const dot = ab[0] * cb[0] + ab[1] * cb[1];
      const magAB = Math.hypot(ab[0], ab[1]);
      const magCB = Math.hypot(cb[0], cb[1]);
      return (Math.acos(dot / (magAB * magCB)) * 180) / Math.PI;
    };
    const isArmVertical = (shoulder, wrist) => {
      const dx = shoulder.x - wrist.x;
      const dy = shoulder.y - wrist.y;
      const angle = Math.abs((Math.atan2(dy, dx) * 180) / Math.PI);
      return angle > 70 && angle < 110;
    };
    const areElbowsTogether = (le, re, threshold = 0.2) => {
      const dx = le.x - re.x;
      const dy = le.y - re.y;
      return Math.hypot(dx, dy) < threshold;
    };
    const smoothPath = (path, k = 5) => {
      const smoothed = [];
      for (let i = 0; i < path.length; i++) {
        let xSum = 0,
          ySum = 0,
          count = 0;
        for (let j = i - Math.floor(k / 2); j <= i + Math.floor(k / 2); j++) {
          if (path[j]) {
            xSum += path[j].x;
            ySum += path[j].y;
            count++;
          }
        }
        smoothed.push({ x: xSum / count, y: ySum / count });
      }
      return smoothed;
    };
    const findExtrema = (yVals) => {
      const peaks = [];
      for (let i = 1; i < yVals.length - 1; i++) {
        if (yVals[i] > yVals[i - 1] && yVals[i] > yVals[i + 1])
          peaks.push({ type: "max", y: yVals[i], index: i });
        if (yVals[i] < yVals[i - 1] && yVals[i] < yVals[i + 1])
          peaks.push({ type: "min", y: yVals[i], index: i });
      }
      return peaks;
    };

    poseInstance.onResults((results) => {
      resizeCanvas();
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      ctx.strokeStyle = "green";
      ctx.lineWidth = 6;
      ctx.strokeRect(canvasEl.width * 0.2, canvasEl.height * 0.2, canvasEl.width * 0.6, canvasEl.height * 0.6);

      if (!results.poseLandmarks) return;

      const now = performance.now();
      if (!window.frameTimes) window.frameTimes = [];
      window.frameTimes.push(now);
      if (window.frameTimes.length > 60) window.frameTimes.shift();

      let textLine = 60;
      const drawLine = (text, color = "white") => {
        ctx.fillStyle = color;
        ctx.font = `${canvasEl.height * 0.04}px Arial`;
        ctx.fillText(text, 20, textLine);
        textLine += canvasEl.height * 0.05;
      };

      const lm = results.poseLandmarks;
      const ls = lm[11],
        rs = lm[12],
        le = lm[13],
        re = lm[14],
        lw = lm[15],
        rw = lm[16];

      // 畫手臂
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(ls.x * canvasEl.width, ls.y * canvasEl.height);
      ctx.lineTo(le.x * canvasEl.width, le.y * canvasEl.height);
      ctx.lineTo(lw.x * canvasEl.width, lw.y * canvasEl.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rs.x * canvasEl.width, rs.y * canvasEl.height);
      ctx.lineTo(re.x * canvasEl.width, re.y * canvasEl.height);
      ctx.lineTo(rw.x * canvasEl.width, rw.y * canvasEl.height);
      ctx.stroke();

      const leftAngle = calcAngle(ls, le, lw);
      const rightAngle = calcAngle(rs, re, rw);
      drawLine(`左肘角度: ${leftAngle.toFixed(1)}`);
      drawLine(`右肘角度: ${rightAngle.toFixed(1)}`);
      if (leftAngle < 160 || rightAngle < 160)
        drawLine("⚠️ 手肘未打直", "yellow") || playVoiceAlert("elbow");

      if (!window.wristNotUnderShoulderStart) window.wristNotUnderShoulderStart = null;
      const wristNotUnderShoulder = !isArmVertical(ls, lw) || !isArmVertical(rs, rw);
      if (wristNotUnderShoulder) {
        if (!window.wristNotUnderShoulderStart) window.wristNotUnderShoulderStart = now;
        const duration = now - window.wristNotUnderShoulderStart;
        if (duration >= 5000)
          drawLine("⚠️ 手腕未在肩膀正下方（超過5秒）", "yellow");
      } else window.wristNotUnderShoulderStart = null;

      if (!areElbowsTogether(le, re)) drawLine("⚠️ 雙手未交疊", "yellow");

      if (!window[pressPathName]) window[pressPathName] = [];
      const pressPoint = midpoint(lw, rw);
      const px = pressPoint.x * canvasEl.width;
      const py = pressPoint.y * canvasEl.height;
      window[pressPathName].push({ x: px, y: py });
      if (window[pressPathName].length > 60) window[pressPathName].shift();

      const smoothedPath = smoothPath(window[pressPathName]);
      const yValues = smoothedPath.map((p) => p.y);
      const extrema = findExtrema(yValues);

      const depths = [];
      for (let i = 1; i < extrema.length - 1; i++) {
        const prev = extrema[i - 1],
          curr = extrema[i],
          next = extrema[i + 1];
        if (prev.type === "max" && curr.type === "min" && next.type === "max") {
          depths.push(Math.max(prev.y - curr.y, next.y - curr.y));
        }
      }

      if (depths.length > 0) {
        const avgDepth = depths.reduce((a, b) => a + b, 0) / depths.length;
        const stdDepth = Math.sqrt(
          depths.reduce((sum, d) => sum + Math.pow(d - avgDepth, 2), 0) / depths.length
        );
        if (stdDepth > 15)
          drawLine("⚠️ 壓胸深度不穩定", "yellow") || playVoiceAlert("deep");
      } else drawLine("⚠️ 無法判斷壓胸深度（動作過少）", "yellow");

      const elbowsTogether = areElbowsTogether(le, re);
      if (elbowsTogether) {
        if (!window[pressTimestampsName]) window[pressTimestampsName] = [];
        if (!window[pressStartTimeName]) window[pressStartTimeName] = now;

        const intervals = [];
        for (let i = 1; i < window[pressTimestampsName].length; i++) {
          intervals.push(
            window[pressTimestampsName][i] - window[pressTimestampsName][i - 1]
          );
        }
        if (window[pressTimestampsName].length >= 5) {
          const avgInterval =
            intervals.reduce((a, b) => a + b, 0) / intervals.length;
          const frequency = 60000 / avgInterval;
          drawLine(
            `壓胸頻率: ${frequency.toFixed(1)} 下/分`,
            frequency >= 100 && frequency <= 120 ? "lime" : "yellow"
          );
          if (frequency < 100 || frequency > 120) {
            drawLine("⚠️ 壓胸頻率不正確 (建議 100~120)", "yellow");
            if (frequency < 100) playVoiceAlert("slow");
            if (frequency > 120) playVoiceAlert("quick");
          }
        }
      } else {
        window[pressTimestampsName] = [];
        window[pressStartTimeName] = null;
        drawLine("⚠️ 雙手未交疊，壓胸頻率清空", "yellow");
      }
    });
  };

  // ====== 相機初始化（離線載入 MediaPipe Pose） ======
  useEffect(() => {
    const initCamera = async () => {
      if (!videoRef.current) return;

      // 動態載入本地 MediaPipe Pose loader
      await new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "/mediapipe/pose/pose_solution_packed_assets_loader.js";
        script.onload = resolve;
        document.body.appendChild(script);
      });

      // 等 wasm 檔案也載入完成
      await new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "/mediapipe/pose/pose_solution_simd_wasm_bin.js";
        script.onload = resolve;
        document.body.appendChild(script);
      });

      // 初始化 Pose
      const pose = new window.Pose.Pose({
        locateFile: (file) => `/mediapipe/pose/${file}`, // 指向本地資料夾
      });

      pose.setOptions({
        modelComplexity: 2,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.7,
      });

      setupPose(videoRef.current, canvasRef.current, pose, "pressPath", "pressTimestamps", "pressStartTime");

      if (cameraRef.current) await cameraRef.current.stop();
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => await pose.send({ image: videoRef.current }),
        width: 640,
        height: 480,
        facingMode: currentFacing.current,
      });
      cameraRef.current.start();
    };

    initCamera();
  }, []);

  const switchCamera = () => {
    currentFacing.current = currentFacing.current === "user" ? "environment" : "user";
    if (cameraRef.current) cameraRef.current.stop().then(() => cameraRef.current.start());
  };

  // ====== Demo Video ======
  useEffect(() => {
    if (!demoVideoRef.current || !demoCanvasRef.current) return;

    const poseDemo = new window.Pose.Pose({
      locateFile: (file) => `/mediapipe/pose/${file}`, // 指向本地
    });
    poseDemo.setOptions({
      modelComplexity: 2,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.7,
    });

    setupPose(demoVideoRef.current, demoCanvasRef.current, poseDemo, "pressPath2", "pressTimestamps2", "pressStartTime2");

    demoVideoRef.current.playbackRate = 0.82;

    const loop = async () => {
      if (demoVideoRef.current.paused || demoVideoRef.current.ended) return;
      await poseDemo.send({ image: demoVideoRef.current });
      requestAnimationFrame(loop);
    };
    demoVideoRef.current.onplay = loop;
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} />
        <button className={styles.voiceBtn} onClick={() => setVoiceEnabled(!voiceEnabled)}>
          <i className={`fi fi-rr-megaphone ${voiceEnabled ? "" : "muted"}`} />
        </button>
        <button className={styles.switchCameraBtn} onClick={switchCamera}>
          <i className="fi fi-rr-refresh" />
        </button>
      </div>
      <div className={styles.panel}>
        <video ref={demoVideoRef} autoPlay loop muted playsInline src="/pose/CPR_demonstration.mov" />
        <canvas ref={demoCanvasRef} />
      </div>
    </div>
  );
};

export default CprPose;
