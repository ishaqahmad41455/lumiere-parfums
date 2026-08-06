"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";

const BottleScene = dynamic(
  () => import("@/components/three/BottleScene").then((m) => m.BottleScene),
  { ssr: false }
);

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden bg-noir-radial">
      <motion.div style={{ opacity, scale }} className="absolute inset-0">
        <BottleScene interactive={false} className="h-full w-full" />
      </motion.div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="eyebrow text-gold"
        >
          The New Composition
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="mt-4 font-display text-5xl text-cream md:text-8xl"
        >
          Noir <span className="text-shimmer italic">Absolu</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="mt-6 max-w-md text-sm text-cream/70 md:text-base"
        >
          Oud, saffron, and black amber layered into a scent that lingers
          like memory. Hand-poured. Individually numbered.
        </motion.p>
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          href="/product/noir-absolu"
          className="mt-10 rounded-full border border-gold px-8 py-3 eyebrow text-gold transition hover:bg-gold hover:text-noir"
          data-cursor-hover
        >
          Discover the Bottle
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/50"
      >
        <ChevronDown className="animate-bounce" size={20} />
      </motion.div>
    </section>
  );
}
