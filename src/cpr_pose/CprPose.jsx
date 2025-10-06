import { useEffect } from "react";
import styles from "./CprPose.module.css";

export default function CprPose() {
  useEffect(() => {
    // === 動態載入 MediaPipe ===
    const script1 = document.createElement("script");
    script1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/pose";
    const script2 = document.createElement("script");
    script2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils";
    const script3 = document.createElement("script");
    script3.src = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils";

    document.body.appendChild(script1);
    document.body.appendChild(script2);
    document.body.appendChild(script3);

    // === 主初始化 ===
    const init = () => {
      if (!window.Pose || !window.Camera) return;

      const video = document.getElementById("video");
      const canvas = document.getElementById("canvas");
      const demoVideo = document.getElementById("demoVideo");
      const demoCanvas = document.getElementById("demoCanvas");

      const pose = new window.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      const pose2 = new window.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      // === 原始 setupPose ===
      function setupPose(videoElement, canvasElement, poseInstance) {
        const ctx = canvasElement.getContext("2d");
        const resizeCanvas = () => {
          if (videoElement.videoWidth && videoElement.videoHeight) {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
          }
        };
        videoElement.addEventListener("loadedmetadata", resizeCanvas);
        poseInstance.onResults((results) => {
          resizeCanvas();
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          if (!results.poseLandmarks) return;
          window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS,
            { color: "lime", lineWidth: 4 });
          window.drawLandmarks(ctx, results.poseLandmarks,
            { color: "red", lineWidth: 2 });
        });
      }

      pose.setOptions({
        modelComplexity: 2,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.7,
      });
      pose2.setOptions({
        modelComplexity: 2,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.7,
      });

      setupPose(video, canvas, pose);
      setupPose(demoVideo, demoCanvas, pose2);

      let camera;
      async function startCamera(facingMode = "user") {
        if (camera) await camera.stop();
        camera = new window.Camera(video, {
          onFrame: async () => await pose.send({ image: video }),
          width: 640,
          height: 480,
          facingMode,
        });
        camera.start();
      }
      startCamera();

      const switchBtn = document.getElementById("switchCamera");
      let facing = "user";
      switchBtn.addEventListener("click", () => {
        facing = facing === "user" ? "environment" : "user";
        startCamera(facing);
      });

      // 示範影片循環偵測
      demoVideo.onplay = function loopDetection() {
        requestAnimationFrame(async () => {
          await pose2.send({ image: demoVideo });
          loopDetection();
        });
      };
    };

    // 等待 MediaPipe 載入後初始化
    const checkReady = setInterval(() => {
      if (window.Pose && window.Camera && window.drawConnectors) {
        clearInterval(checkReady);
        init();
      }
    }, 500);

    return () => clearInterval(checkReady);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <video id="video" autoPlay playsInline muted></video>
        <canvas id="canvas"></canvas>
        <button id="toggleVoice" className={styles.voiceBtn}>
          <i id="voiceIcon" className="fi fi-rr-megaphone"></i>
        </button>
        <button id="switchCamera" className={styles.switchCameraBtn}>
          <i className="fi fi-rr-refresh"></i>
        </button>
      </div>

      <div className={styles.panel}>
        <video
          id="demoVideo"
          autoPlay
          loop
          muted
          playsInline
          src="/pose/CPR_demonstration.mov"
        ></video>
        <canvas id="demoCanvas"></canvas>
      </div>
    </div>
  );
}
