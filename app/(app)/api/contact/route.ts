import ContactForm from '@/components/email/contact-form';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/schemas/env.schema';
import { Resend } from 'resend';
import { contactSchema } from '@/schemas/api/contact.schema';
import z from 'zod';

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  const { name, email, message } = parsed.data;

  try {
    await resend.emails.send({
      from: env.RESEND_FROM_ADDRESS,
      to: env.CONTACT_RECEIVER_EMAIL,
      subject: 'Contact Form',
      react: ContactForm({
        name,
        email,
        message,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
