import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // IMPORTANT: Store and access this password securely, e.g., via environment variables.
    // For this example, we'll use an environment variable or a default.
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "defaultsecurepassword123";

    if (!process.env.ADMIN_PASSWORD) {
        console.warn("WARNING: ADMIN_PASSWORD environment variable not set. Using default password for login.");
    }

    if (password === ADMIN_PASSWORD) {
      // Set a cookie to signify authentication
      cookies().set('admin-auth-token', 'true', { // Value can be anything, presence is key for middleware
        httpOnly: true, // Not accessible via client-side JavaScript
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        path: '/admin', // Scope cookie to admin paths
        sameSite: 'lax', // Mitigates CSRF
        maxAge: 60 * 60 * 8, // Expires in 8 hours
      });
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
