import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(254, 'Email is too long'),
  password: z.string().min(1, 'Password is required').max(256, 'Password is too long'),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitResult = rateLimit(`login:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many login attempts. Please try again in a minute.' }, { status: 429 });
    }

    const body = await req.json();

    // Validate request body
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = result.data;

    const supabase = await createServerSupabaseClient();

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ 
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
