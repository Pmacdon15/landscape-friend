import { fetchGeocode } from '@/lib/utils/geocode';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
  }

  try {
    const geocodeData = await fetchGeocode(address);
    return NextResponse.json(geocodeData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Geocoding failed: ${errorMessage}` }, { status: 500 });
  }
}
