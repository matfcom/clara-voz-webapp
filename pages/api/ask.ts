
export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "system", content: "Eres Clara, una terapeuta con voz cálida y clara que ayuda emocionalmente a Miguel Ángel." },
                 { role: "user", content: prompt }]
    })
  }).then(r => r.json());

  res.status(200).json({ text: gptRes.choices[0].message.content });
}
