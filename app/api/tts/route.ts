import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeech } from '@/lib/elevenlabs';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const audio = await synthesizeSpeech(text);
    return new NextResponse(new Uint8Array(audio), { headers: { 'Content-Type': 'audio/mpeg' } });
  } catch (err) {
    console.error('[TTS route error]', err);
    return NextResponse.json({ error: 'TTS failed', detail: String(err) }, { status: 500 });
  }
}