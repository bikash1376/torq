import { NextRequest, NextResponse } from 'next/server';

// Proxy endpoint for neural TTS to avoid CORS issues
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, voice = 'en-US-EmmaNeural', rate = '+0%', pitch = '+0Hz' } = body;

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        console.log('[TTS API] Generating speech for:', text.substring(0, 50) + '...');

        const response = await fetch('https://neural-tts.vercel.app/api/ms-tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                voice,
                rate,
                pitch,
                includeSrt: true,
            }),
        });

        if (!response.ok) {
            console.error('[TTS API] External API error:', response.status);
            return NextResponse.json({ error: 'TTS service error' }, { status: 500 });
        }

        const data = await response.json();

        console.log('[TTS API] Success, word count:', data.wordCount);

        return NextResponse.json({
            audio: data.audio, // Base64 encoded audio
            srt: data.srt,
            wordCount: data.wordCount,
        });
    } catch (error) {
        console.error('[TTS API] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
