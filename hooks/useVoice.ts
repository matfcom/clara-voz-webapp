import { useState, useRef } from "react"

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    setTranscript("")
    setIsRecording(true)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData
      })

      const data = await res.json()
      setTranscript(data.text)
    }

    mediaRecorder.start()
  }

  const stopRecording = async () => {
    return new Promise<string | null>(resolve => {
      const recorder = mediaRecorderRef.current
      if (recorder && recorder.state !== "inactive") {
        recorder.stop()
        setIsRecording(false)
        setTimeout(() => {
          resolve(transcript || null)
        }, 1000)
      } else {
        resolve(null)
      }
    })
  }

  const speakResponse = async (text: string) => {
    setIsSpeaking(true)
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audio.play()
    audio.onended = () => setIsSpeaking(false)
  }

  return { isRecording, isSpeaking, transcript, startRecording, stopRecording, speakResponse }
}
