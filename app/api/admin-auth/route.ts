import { NextResponse } from 'next/server';

// Simulate the environment variable for this subtask
const ADMIN_PASSWORD = "admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, message: 'Password is required.' }, { status: 400 });
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Incorrect password.' }, { status: 401 });
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
