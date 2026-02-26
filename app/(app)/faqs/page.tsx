'use client';
import { useState } from 'react';
import HeaderLabel from '@/components/header-label';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    category: 'Orders',
    items: [
      {
        q: 'How do I track my order?',
        a: 'Once your order is shipped, you will receive a tracking number via email. You can use it to track your package on the courier website.',
      },
      {
        q: 'Can I cancel or modify my order?',
        a: 'Orders can be cancelled or modified within 12 hours of placement. After that, the order enters processing and cannot be changed.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 5–7 business days. Express delivery (2–3 days) is available at checkout for select pin codes.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Go to your account → Orders → select the order → click Return. Our team will arrange a pickup within 48 hours.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5–7 business days after we receive the returned item. The amount is credited to your original payment method.',
      },
    ],
  },
  {
    category: 'Products',
    items: [
      {
        q: 'How do I find the right size?',
        a: 'Each product page has a size guide. We recommend measuring your chest, waist, and hips and comparing against our size chart before ordering.',
      },
      {
        q: 'Are the colors accurate?',
        a: 'We do our best to show accurate colors, but slight variations may occur due to screen settings. If unsure, reach out to us before ordering.',
      },
    ],
  },
  {
    category: 'Payments',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit/debit cards, UPI, net banking, and wallets via Stripe.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. All payments are processed by Stripe which is PCI DSS compliant. We never store your card details on our servers.',
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-2 border-black">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 font-bold text-left hover:bg-black hover:text-white transition-colors"
      >
        <span>{q}</span>
        <ChevronDown size={18} className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 text-sm leading-relaxed border-t-2 border-black text-muted-foreground">{a}</div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="px-4 md:px-14 py-12 min-h-screen">
      <div className="flex flex-col w-full justify-center items-center gap-2">
        <HeaderLabel text="FAQs" />
        <p className="text-muted-foreground mt-2 mb-10">Everything you need to know about Vendo.</p>
      </div>

      <div className="flex flex-col gap-10">
        {faqs.map(section => (
          <div key={section.category}>
            <h2 className="text-xs font-black uppercase tracking-widest mb-3 text-muted-foreground">
              {section.category}
            </h2>
            <div className="flex flex-col gap-[-2px] shadow-[6px_6px_0px_#000]">
              {section.items.map(item => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Still have questions */}
      <div className="mt-14 border-2 border-black shadow-[6px_6px_0px_#000] p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-black text-xl">Still have questions?</p>
          <p className="text-muted-foreground text-sm">We&apos;re happy to help.</p>
        </div>
        <Link
          href="/contact"
          className="border-2 border-black bg-black text-white font-black px-6 py-3 shadow-[3px_3px_0px_#555] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
        >
          Contact Us →
        </Link>
      </div>
    </div>
  );
}
