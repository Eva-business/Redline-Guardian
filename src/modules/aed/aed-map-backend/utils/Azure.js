const axios = require('axios');

const GPT_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const GPT_API_BASE = process.env.AZURE_OPENAI_ENDPOINT;
const GPT_DEPLOYMENT = process.env.AZURE_OPENAI_ENGINE;
const GPT_API_VERSION = process.env.AZURE_OPENAI_API_VERSION;

async function fallbackWithGPT(nameOrAddress, currentTime) {
  const prompt = `地點：${nameOrAddress}\n現在時間是 ${currentTime}，請推論這個地點現在是否有營業? 只回答 true 或 false，不要其他文字。`;

  const response = await axios.post(
    `${GPT_API_BASE}openai/deployments/${GPT_DEPLOYMENT}/chat/completions?api-version=${GPT_API_VERSION}`,
    {
      messages: [
        { role: 'system', content: '你是地點營業時間的推論助理，只回答 true 或 false。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
      max_tokens: 5
    },
    {
      headers: {
        'api-key': GPT_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  const reply = response.data.choices[0].message.content.trim().toLowerCase();

  if (reply === 'true') return true;
  if (reply === 'false') return false;

  return null;
}

module.exports = { fallbackWithGPT };
