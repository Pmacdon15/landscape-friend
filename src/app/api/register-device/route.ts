import { registerNovuDevice } from '@/lib/actions/novu-action';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, userId } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'FCM token is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const result = await registerNovuDevice(token, userId);

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('API Route: Error registering device:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
