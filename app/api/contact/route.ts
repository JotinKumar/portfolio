import { after, NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Resend } from 'resend';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { isTrustedStateChangingRequest } from '@/lib/request-security';

// Define schema for contact form validation
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(254, 'Email is too long'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
}).strict();

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
};

// Simple sanitization function to prevent basic script injection in emails
const sanitizeHtml = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const sendContactNotification = async (name: string, email: string, message: string) => {
  const resend = getResendClient();
  if (!resend) {
    console.warn('RESEND_API_KEY is not set; skipping email notification.');
    return;
  }

  const sanitizedName = sanitizeHtml(name);
  const sanitizedEmail = sanitizeHtml(email);
  const sanitizedMessage = sanitizeHtml(message).replace(/\n/g, '<br>');

  await resend.emails.send({
    from: 'Portfolio Contact <noreply@jotin.in>',
    to: ['contact@jotin.in'],
    subject: `New Contact Form Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Contact Details:</h3>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="line-height: 1.6; color: #555;">${sanitizedMessage}</p>
        </div>
      </div>
    `,
  });
};

export async function POST(req: NextRequest) {
  try {
    if (!isTrustedStateChangingRequest(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ip = getClientIp(req);
    const rateLimitResult = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
    }

    const body = await req.json();
    
    // Validate request body
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { name, email, message } = result.data;

    const supabase = await createServerSupabaseClient();
    const { error: insertError } = await supabase
      .from('Contact')
      .insert({
        name,
        email,
        message,
      });
    if (insertError) {
      throw insertError;
    }

    after(async () => {
      try {
        await sendContactNotification(name, email, message);
      } catch (emailError) {
        console.error('Failed to send email via Resend:', emailError);
      }
    });

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
