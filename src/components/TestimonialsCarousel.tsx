"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Sarah Johnson',
    text: "The best laundry service I've ever used. They managed to get out a stain I thought was permanent.",
    initials: 'SJ'
  },
  {
    id: 't2',
    name: 'Michael Chen',
    text: "Super fast and incredibly reliable. I travel constantly for work and they always make sure my suits look pristine.",
    initials: 'MC'
  },
  {
    id: 't3',
    name: 'Emma Williams',
    text: "I love how eco-friendly their process is. The clothes smell naturally fresh, not overpowered with chemical perfumes.",
    initials: 'EW'
  }
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-20 bg-[var(--color-background-secondary)] dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-8">What our customers say</h2>

        <div className="relative h-56">
          <AnimatePresence mode="wait">
            {TESTIMONIALS.map((t, i) => i === index && (
              <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45 }} className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[var(--color-background-primary)] dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-[var(--color-border-tertiary)] max-w-3xl mx-auto text-left flex items-center gap-6">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-white bg-teal-500 font-black text-slate-950 shadow-sm dark:border-slate-900">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[var(--color-text-muted)] italic mb-2">&ldquo;{t.text}&rdquo;</p>
                    <p className="font-semibold text-[var(--color-text-primary)]">{t.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} aria-label={`Go to testimonial ${i+1}`} onClick={() => setIndex(i)} className={`w-3 h-3 rounded-full ${i===index ? 'bg-[var(--accent)]' : 'bg-gray-300'}`}></button>
          ))}
        </div>
      </div>
    </section>
  );
}
