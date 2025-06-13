import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Clear the authentication cookie by setting its maxAge to 0
    cookies().set('admin-auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/admin', // Must match the path used when setting the cookie
      sameSite: 'lax',
      maxAge: 0, // Expire the cookie immediately
    });

    return NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout API error:', error);
    // Even if there's an error, the client will likely proceed as if logged out.
    // However, good to log it.
    return NextResponse.json({ message: 'An error occurred during logout' }, { status: 500 });
  }
}
