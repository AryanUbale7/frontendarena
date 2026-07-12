"use client"

import * as React from "react"
import { motion, useScroll } from "framer-motion"
import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { RiftRing } from "@/components/signature/RiftRing"

export interface EventHeroProps {
  event?: {
    id: string
    name: string
    description: string
    start_date: string
    end_date: string
    status: string
  }
}

export function EventHero({ event }: EventHeroProps) {
  const { scrollY } = useScroll()

  // Force timer to show 00 00 00 00 (registrations closed)
  const targetDate = new Date("2026-01-01")
  const eventName = event?.name || "Frontend Wars 2026"
  const eventDesc = event?.description || "Three days of grueling challenges, live judging, and architectural battles. Prove your mastery."

  return (
    <section className="relative min-h-[100svh] w-full pt-32 pb-16 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background RiftRing spanning massive area */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 mix-blend-screen scale-[1.5] md:scale-[2] lg:scale-[2.5]">
        <RiftRing 
          variant="gold" 
          size={500} 
          interactive={false}
          scrollProgress={scrollY}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
        
        {/* Top Tagline */}
        <motion.div 
          className="px-4 py-1.5 border border-surface-border rounded-full bg-surface-hover/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-sm font-mono text-text-secondary uppercase tracking-widest">
            The World Championship of Code
          </span>
        </motion.div>

        {/* Monument Headline */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-9xl font-heading font-bold uppercase tracking-tighter"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
        >
          {eventName.split(" ").slice(0, -1).join(" ")} <span className="text-accent-gold block mt-2 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]">{eventName.split(" ").slice(-1)[0]}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-xl md:text-2xl text-text-secondary font-body max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {eventDesc}
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-sm font-mono text-accent-gold uppercase tracking-widest mb-4">Registrations Closed</p>
          <CountdownTimer targetDate={targetDate} />
        </motion.div>

      </div>
    </section>
  )
}
