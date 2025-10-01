// package.json 要設定 "type": "module"

// server.js 或 index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import cors from "cors";
import { fileURLToPath } from "url";

// ES Module 裡沒有 __dirname，要用以下方式取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  AZURE_OPENAI_ENDPOINT,
  API_KEY,
  DEPLOYMENT_NAME,
  API_VERSION,
} = process.env;

const app = express();
const PORT = process.env.PORT || 3000;  // ← Render 會提供 PORT

app.use(cors({
  origin: '*', 
}));

app.use(express.static("public"));

// 確保 uploads 目錄存在
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ dest: uploadDir });

const symptoms = [
  "無意識(昏迷)且無呼吸",
  "抓喉、臉色發紫",
  "無意識(昏迷)且有呼吸",
  "皮膚紅疹、腫脹、呼吸困難",
  "癲癇、身體抽搐",
  "出血不止",
  "熱燙傷、化學燙傷",
  "皮膚紅疹、發癢、鼻水、眼癢、喉癢",
];

function generatePrompt() {
  return `請你判斷這張圖片中患者的症狀是哪一個，並只回傳對應的項目：
${symptoms.map((s, i) => `${i + 1}. ${s}`).join("\n")}

請只輸出對應的症狀文字，不要加其他說明。`;
}

async function callAzureOpenAI(base64Image, prompt) {
  const url = `${AZURE_OPENAI_ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`;

  const headers = {
    "Content-Type": "application/json",
    "api-key": API_KEY,
  };

  const body = {
    messages: [
      {
        role: "system",
        content: "你是一位能從圖片判斷患者症狀的醫學助理。",
      },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    temperature: 0.2,
    max_tokens: 200,
  };

  const response = await axios.post(url, body, { headers });
  return response.data.choices[0].message.content.trim();
}

app.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("未上傳影片");
  }

  const videoPath = req.file.path;
  const framesDir = path.join(__dirname, "frames_" + uuidv4());

  let responseSent = false;

  function cleanup() {
    try {
      if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    } catch (err) {
      console.warn("⚠️ 清理檔案時發生錯誤:", err.message);
    }
  }

  try {
    fs.mkdirSync(framesDir);

    if (!fs.existsSync(videoPath)) {
      cleanup();
      return res.status(400).send("影片檔案不存在，請重新上傳");
    }

    ffmpeg(videoPath)
      .on("end", async () => {
        try {
          const frameFiles = fs
            .readdirSync(framesDir)
            .filter((f) => f.endsWith(".png"));

          if (frameFiles.length === 0) {
            throw new Error("擷取不到任何影格，請上傳清晰影片");
          }

          const prompt = generatePrompt();
          const results = [];

          for (const file of frameFiles) {
            const imgPath = path.join(framesDir, file);
            const imgBuffer = fs.readFileSync(imgPath);
            const base64Image = imgBuffer.toString("base64");

            if (!base64Image || base64Image.length < 100) continue;

            const result = await callAzureOpenAI(base64Image, prompt);
            results.push(result);
          }

          if (results.length === 0) {
            throw new Error("無有效影格結果");
          }

          const freq = {};
          results.forEach((r) => {
            freq[r] = (freq[r] || 0) + 1;
          });
          const finalResult = Object.entries(freq).sort(
            (a, b) => b[1] - a[1]
          )[0][0];

          if (!responseSent) {
            responseSent = true;
            res.send(finalResult);
          }
        } catch (err) {
          console.error("🛑 分析錯誤:", err);
          if (!responseSent) {
            responseSent = true;
            res.status(500).send("影片分析失敗，請確認影片畫面清楚。");
          }
        } finally {
          cleanup();
        }
      })
      .on("error", (err) => {
        console.error("❌ ffmpeg 錯誤:", err.message);
        if (!responseSent) {
          responseSent = true;
          res.status(500).send("擷取影格時發生錯誤，請確認影片格式為 MP4");
        }
        cleanup();
      })
      .screenshots({
        count: 5,
        folder: framesDir,
        filename: "frame-%i.png",
        size: "640x?",
      });
  } catch (e) {
    console.error("❌ 系統錯誤:", e.message);
    if (!responseSent) {
      responseSent = true;
      res.status(500).send("影片處理失敗：" + e.message);
    }
    try {
      cleanup();
    } catch {}
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

