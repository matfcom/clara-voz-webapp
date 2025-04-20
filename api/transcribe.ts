/// <reference types="node" />
import { Buffer } from 'buffer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  const audioBase64 = req.body.audioBase64;

  const audioBuffer = Buffer.from(audioBase64, 'base64');
  const formData = new FormData();
  formData.append('file', new Blob([audioBuffer]), 'audio.webm');
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: formData
  });

  const data = await response.json();
  res.status(200).json(data);
}
