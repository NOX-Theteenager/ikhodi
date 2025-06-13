import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      console.error('CRITICAL: ADMIN_PASSWORD environment variable is not set. Admin login is disabled.');
      return NextResponse.json({ message: 'Authentication system not configured on server.' }, { status: 500 });
    }

    // Ensure ADMIN_PASSWORD is not an empty string after trimming.
    if (ADMIN_PASSWORD.trim() === '') {
        console.error('CRITICAL: ADMIN_PASSWORD environment variable is set but effectively empty. Admin login is disabled.');
        return NextResponse.json({ message: 'Authentication system not properly configured on server.' }, { status: 500 });
    }

    if (password === ADMIN_PASSWORD) {
      // Set a cookie to signify authentication
      cookies().set('admin-auth-token', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/admin',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
      });
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    // Check if the error is due to invalid JSON in the request body
    if (error instanceof SyntaxError && (error as any).body === true) { // Next.js might throw SyntaxError with body:true
        return NextResponse.json({ message: 'Invalid JSON format in request body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'An internal server error occurred during login' }, { status: 500 });
  }
}
