import ContactForm from '@/components/email/contact-form';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_ADDRESS!,
    to: process.env.CONTACT_RECEIVER_EMAIL!,
    subject: 'Contact Form',
    react: ContactForm({
      name,
      email,
      message,
    }),
  });

  return NextResponse.json({ success: true });
}
