import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'CivicLens is awake!',
    timestamp: new Date().toISOString() 
  });
}
