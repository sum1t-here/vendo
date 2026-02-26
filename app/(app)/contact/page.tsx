'use client';
import { useState } from 'react';
import HeaderLabel from '@/components/header-label';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // wire to your email/API later
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('sent');
  };

  return (
    <div className="px-4 md:px-14 py-12 min-h-screen">
      <div className="flex flex-col w-full justify-center items-center gap-2">
        <HeaderLabel text="Contact Us" />
        <p className="text-muted-foreground mt-2 mb-10">
          Note: I can add the form backend with nodemailer or any other service you prefer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Left — Info */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-black shadow-[6px_6px_0px_#000] p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Email</p>
            <p className="font-black text-lg">support@vendo.com</p>
          </div>
          <div className="border-2 border-black shadow-[6px_6px_0px_#000] p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Hours</p>
            <p className="font-black">Mon – Fri</p>
            <p className="text-muted-foreground text-sm">10:00 AM – 6:00 PM IST</p>
          </div>
          <div className="border-2 border-black shadow-[6px_6px_0px_#000] p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Response Time</p>
            <p className="font-black">Within 24 hours</p>
            <p className="text-muted-foreground text-sm">We read every message.</p>
          </div>
        </div>

        {/* Right — Form */}
        <form
          onSubmit={handleSubmit}
          className="border-2 border-black shadow-[6px_6px_0px_#000] p-6 flex flex-col gap-4"
        >
          {status === 'sent' ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
              <span className="text-4xl">✅</span>
              <p className="font-black text-xl">Message sent!</p>
              <p className="text-muted-foreground text-sm text-center">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="border-2 border-black p-2 bg-background focus:outline-none focus:shadow-[2px_2px_0px_black]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="border-2 border-black p-2 bg-background focus:outline-none focus:shadow-[2px_2px_0px_black]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="border-2 border-black p-2 bg-background focus:outline-none focus:shadow-[2px_2px_0px_black] resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-black text-white font-black py-3 border-2 border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50 shadow-[3px_3px_0px_#555] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message →'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
