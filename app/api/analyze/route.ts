import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocument } from '@/lib/gemini';

export async function POST(req: NextRequest){
    try {
        const { image, language, zipcode } = await req.json(); 
        const result = await analyzeDocument(image, language, zipcode);
        return NextResponse.json(result);
    } catch(err) {
        console.error(err);
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
    }
}