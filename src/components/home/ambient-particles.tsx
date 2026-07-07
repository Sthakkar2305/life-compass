"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  size: 4 + (index % 5) * 2,
  delay: (index % 7) * 0.45
}));

export function AmbientParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white/60 shadow-[0_0_22px_rgba(245,158,11,.35)] dark:bg-amber-200/20"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.22, 0.75, 0.22],
            scale: [0.9, 1.2, 0.9]
          }}
          transition={{
            duration: 5.4 + (particle.id % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
}
