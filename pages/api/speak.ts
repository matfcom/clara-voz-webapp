
export default async function handler(req, res) {
  const { text } = req.query;
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = "EXAVITQu4vr4xnSDxMaL";  // reemplázalo si usas otro ID

  const audioRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": apiKey
    },
    body: JSON.stringify({
      text: decodeURIComponent(text),
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    })
  });

  const audioBuffer = await audioRes.arrayBuffer();
  res.setHeader("Content-Type", "audio/mpeg");
  res.send(Buffer.from(audioBuffer));
}
