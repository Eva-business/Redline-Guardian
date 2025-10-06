import { useEffect } from "react";
import styles from "./CprPose.module.css";

export default function CprPose() {
  useEffect(() => {
    console.log("CprPose mounted");

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
      console.log("Initializing MediaPipe Pose...");

      if (!window.Pose || !window.Camera || !window.drawConnectors) {
        console.error("MediaPipe modules not loaded yet");
        return;
      }

      const video = document.getElementById("video");
      const canvas = document.getElementById("canvas");
      const demoVideo = document.getElementById("demoVideo");
      const demoCanvas = document.getElementById("demoCanvas");

      if (!video || !canvas || !demoVideo || !demoCanvas) {
        console.error("Video or canvas elements not found");
        return;
      }

      console.log("Elements found:", { video, canvas, demoVideo, demoCanvas });

      const pose = new window.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      const pose2 = new window.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      function setupPose(videoElement, canvasElement, poseInstance) {
        const ctx = canvasElement.getContext("2d");
        if (!ctx) {
          console.error("Failed to get canvas context", canvasElement);
          return;
        }

        const resizeCanvas = () => {
          if (videoElement.videoWidth && videoElement.videoHeight) {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
          }
        };

        videoElement.addEventListener("loadedmetadata", () => {
          console.log(videoElement.id, "loadedmetadata", videoElement.videoWidth, videoElement.videoHeight);
          resizeCanvas();
        });

        poseInstance.onResults((results) => {
          resizeCanvas();
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          if (!results.poseLandmarks) {
            // console.log("No pose landmarks detected yet");
            return;
          }
          window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: "lime", lineWidth: 4 });
          window.drawLandmarks(ctx, results.poseLandmarks, { color: "red", lineWidth: 2 });
          // 可以顯示 landmarks 長度以確認偵測
          console.log("Pose landmarks detected:", results.poseLandmarks.length);
        });
      }

      pose.setOptions({ modelComplexity: 2, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.7 });
      pose2.setOptions({ modelComplexity: 2, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.7 });

      setupPose(video, canvas, pose);
      setupPose(demoVideo, demoCanvas, pose2);

      let camera;
      async function startCamera(facingMode = "user") {
        try {
          if (camera) await camera.stop();
          camera = new window.Camera(video, {
            onFrame: async () => {
              try {
                await pose.send({ image: video });
              } catch (err) {
                console.error("Pose send error:", err);
              }
            },
            width: 640,
            height: 480,
            facingMode,
          });
          await camera.start();
          console.log("Camera started, facingMode:", facingMode);
        } catch (err) {
          console.error("Camera start failed:", err);
        }
      }
      startCamera();

      const switchBtn = document.getElementById("switchCamera");
      let facing = "user";
      if (switchBtn) {
        switchBtn.addEventListener("click", () => {
          facing = facing === "user" ? "environment" : "user";
          console.log("Switching camera to", facing);
          startCamera(facing);
        });
      } else {
        console.warn("Switch camera button not found");
      }

      // 示範影片循環偵測
      demoVideo.onplay = function loopDetection() {
        if (demoVideo.paused || demoVideo.ended) return;
        requestAnimationFrame(async () => {
          try {
            await pose2.send({ image: demoVideo });
          } catch (err) {
            console.error("Demo pose send error:", err);
          }
          loopDetection();
        });
      };

      demoVideo.onerror = (e) => console.error("Demo video load error:", e);
      video.onerror = (e) => console.error("Camera video error:", e);
    };

    const checkReady = setInterval(() => {
      console.log("Checking MediaPipe readiness...", window.Pose, window.Camera, window.drawConnectors);
      if (window.Pose && window.Camera && window.drawConnectors) {
        clearInterval(checkReady);
        console.log("MediaPipe ready, calling init()");
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
