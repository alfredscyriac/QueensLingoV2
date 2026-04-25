import { NextRequest, NextResponse } from "next/server";
import { fetchNearbyResources } from "@/lib/places";

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url); 
    const keywords = searchParams.get('keywords')?.split(',') || [];
    const zipcode = searchParams.get('zipcode') || '11367';
    try {
        const resources = await fetchNearbyResources(keywords, zipcode);
        return NextResponse.json(resources);
    } catch {
        return NextResponse.json([], { status: 500 });
    }
}