import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    // For now, just simulate success
    // Later add: password hashing, database save, etc.
    
    console.log('Creating account for:', { name, email });
    
    return NextResponse.json({
      success: true,
      user: {
        id: Date.now().toString(),
        name,
        email
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create account' },
      { status: 400 }
    );
  }
}