// app/(app)/about/page.tsx
import HeaderLabel from '@/components/header-label';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const values = [
  {
    emoji: '🧵',
    title: 'Quality First',
    description: 'Every piece is made from premium materials. We would rather make less and make it right.',
  },
  {
    emoji: '⚡',
    title: 'Built Different',
    description: 'No fast fashion. No throwaway trends. Just timeless pieces designed to last.',
  },
  {
    emoji: '🌍',
    title: 'Conscious Production',
    description: 'Small batches. Less waste. We only produce what we can sell — nothing more.',
  },
  {
    emoji: '💬',
    title: 'Direct to You',
    description: 'No middlemen. No markups. We sell directly so you get the best price possible.',
  },
];

const stats = [
  { value: '500+', label: 'Orders Delivered' },
  { value: '3', label: 'Product Categories' },
  { value: '100%', label: 'Satisfaction Rate' },
  { value: '24h', label: 'Support Response' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 md:px-14 py-16 border-b-2 border-black flex flex-col w-full justify-center items-center gap-2">
        <HeaderLabel text="About Vendo" />
        <p className="text-xl md:text-2xl font-medium leading-relaxed mt-6 text-muted-foreground">
          We started Vendo because we were tired of paying luxury prices for average clothes. So we built something
          different — a store that puts quality and honesty above everything else.
        </p>
      </section>

      {/* Stats */}
      <section className="px-4 md:px-14 py-12 border-b-2 border-black">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="border-2 border-black shadow-[4px_4px_0px_#000] p-6 flex flex-col gap-1">
              <span className="text-4xl font-black">{stat.value}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="px-4 md:px-14 py-12 border-b-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Our Story</p>
            <h2 className="text-3xl font-black leading-tight mb-6">Built from frustration. Driven by quality.</h2>
            <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                Vendo started in 2024 as a simple idea — what if buying clothes online didn&apos;t have to feel like a
                gamble? Where you actually knew what you were getting before it arrived at your door.
              </p>
              <p>
                We obsess over fabrics, fits, and finishes. Every product goes through multiple rounds of testing before
                it earns a spot in our catalog. If we wouldn&apos;t wear it ourselves, we won&apos;t sell it.
              </p>
              <p>We&apos;re a small team. We ship from India. And we&apos;re building this one product at a time.</p>
            </div>
          </div>

          {/* Decorative block */}
          <div className="hidden md:flex flex-col gap-4">
            <div className="border-2 border-black shadow-[6px_6px_0px_#000] p-8 bg-black text-white">
              <p className="text-2xl font-black leading-snug">“Wear less. Wear better.”</p>
              <p className="text-sm mt-3 text-gray-400">— Vendo, 2024</p>
            </div>
            <div className="border-2 border-black shadow-[6px_6px_0px_#000] p-6">
              <p className="font-black text-lg">Made in India 🇮🇳</p>
              <p className="text-sm text-muted-foreground mt-1">
                Proudly designed and shipped from India to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 md:px-14 py-12 border-b-2 border-black">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-8">What We Stand For</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {values.map(value => (
            <div
              key={value.title}
              className="border-2 border-black shadow-[4px_4px_0px_#000] p-6 flex flex-col gap-3 hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <span className="text-3xl">{value.emoji}</span>
              <p className="font-black">{value.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-14 py-16">
        <div className="border-2 border-black shadow-[6px_6px_0px_#000] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-2xl font-black">Ready to shop?</p>
            <p className="text-muted-foreground mt-1">Browse our latest collection.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/products"
              className="flex items-center gap-2 bg-black text-white font-black px-6 py-3 border-2 border-black shadow-[3px_3px_0px_#555] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 font-black px-6 py-3 border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
