import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("audio") as Blob

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`
    },
    body: (() => {
      const fd = new FormData()
      fd.append("file", new Blob([buffer]), "audio.webm")
      fd.append("model", "whisper-1")
      fd.append("language", "es")
      return fd
    })()
  })

  const data = await response.json()
  return NextResponse.json({ text: data.text })
}
