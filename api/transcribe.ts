/// <reference types="node" />
import { Buffer } from 'buffer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  const audioBuffer = Buffer.from(req.body.audioBase64, 'base64');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: (() => {
      const form = new FormData();
      form.append('file', new Blob([audioBuffer]), 'audio.webm');
      form.append('model', 'whisper-1');
      return form;
    })(),
  });

  const data = await response.json();
  res.status(200).json(data);
}
