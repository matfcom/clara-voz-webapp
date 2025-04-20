import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  const { text } = await req.json()

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres Clara, una terapeuta cálida y empática que siempre habla en español."
        },
        {
          role: "user",
          content: text
        }
      ]
    })
  })

  const data = await response.json()
  const respuesta = data.choices[0].message.content

  const ttsRes = await fetch("https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID/audio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY!
    },
    body: JSON.stringify({
      text: respuesta,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.4, similarity_boost: 0.8 }
    })
  })

  const audio = await ttsRes.blob()
  return new NextResponse(audio, {
    headers: { "Content-Type": "audio/mpeg" }
  })
}
