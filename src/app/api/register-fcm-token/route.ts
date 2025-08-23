// import { NextResponse } from 'next/server';
// import { registerNovuDevice } from '@/DAL/actions/novu'; // Import the existing server action

// export async function POST(request: Request) {
//   console.log('API Route: /api/register-fcm-token - Incoming POST request.');
//   try {
//     const { token, userId } = await request.json();
//     console.log(`API Route: /api/register-fcm-token - Received token: ${token ? 'present' : 'missing'}, userId: ${userId ? 'present' : 'missing'}`);

//     if (!token || !userId) {
//       console.warn('API Route: /api/register-fcm-token - Missing token or userId in request.');
//       return NextResponse.json({ error: 'Missing token or userId' }, { status: 400 });
//     }

//     console.log('API Route: /api/register-fcm-token - Calling registerNovuDevice action.');
//     const result = await registerNovuDevice(token); // Corrected: userId is now handled internally by the action

//     if (result.success) {
//       console.log('API Route: /api/register-fcm-token - Device registered successfully.');
//       return NextResponse.json({ message: result.message }, { status: 200 });
//     } else {
//       console.error(`API Route: /api/register-fcm-token - Failed to register device: ${result.error}`);
//       return NextResponse.json({ error: result.error }, { status: 500 });
//     }
//   } catch (error) {
//     console.error('API Route: /api/register-fcm-token - Error in API route:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
