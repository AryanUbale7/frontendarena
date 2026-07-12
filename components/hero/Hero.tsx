"use client"

import * as React from "react"
import { motion, useScroll, Variants } from "framer-motion"
import { HeroHeadline } from "./HeroHeadline"
import { RiftRing } from "@/components/signature/RiftRing"
import { DataRail } from "@/components/ui/DataRail"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export function Hero() {
  const { scrollY } = useScroll()
  
  // Staggered fade-up for subline and CTA
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.8 } // Occurs after headline
    }
  }

  const ctaVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 1.0 }
    }
  }

  const railVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut", delay: 1.2 }
    }
  }

  return (
    <section className="relative min-h-[100svh] w-full pt-32 pb-16 px-6 md:px-12 lg:px-24 flex items-center justify-center overflow-hidden">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-50 mix-blend-screen"
        >
          <source src="/warrior.mp4" type="video/mp4" />
        </video>
        {/* Radial vignette for cinematic framing & text readability */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#060608_100%)] opacity-90" />
        {/* Bottom gradient to fade into next section */}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent h-1/3 top-auto bottom-0" />
      </div>

      {/* Massive Background Ring (Halo) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 z-0 pointer-events-none scale-150 sm:scale-100">
        <RiftRing 
          variant="gold" 
          interactive={false} 
          size={1000} 
          scrollProgress={scrollY} 
        />
      </div>

      <div className="max-w-[1400px] w-full mx-auto flex flex-col items-center justify-center relative z-10 text-center">
        
        {/* Center Text & CTA */}
        <div className="flex flex-col items-center max-w-3xl">
          <HeroHeadline className="items-center" />
          
          <motion.p 
            className="mt-8 text-xl md:text-2xl text-text-secondary font-body max-w-2xl text-balance drop-shadow-md"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            The global arena for elite frontend engineers. Prove your skills, climb the ranks, and secure your legacy.
          </motion.p>
          
          <motion.div 
            className="mt-12 flex flex-wrap items-center justify-center gap-6"
            variants={ctaVariants}
            initial="hidden"
            animate="visible"
          >
            <Button variant="primary" size="lg" asChild>
              <Link href="/frontend-wars-2026">
                Enter the Arena
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/hall-of-fame">
                View Hall of Fame
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* HUD: Floating DataRails in bottom corners */}
      <motion.div 
        className="absolute bottom-8 left-6 md:left-12 lg:left-24 hidden md:block z-10"
        variants={railVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-start bg-background/40 backdrop-blur-md border border-surface-border p-4 rounded-lg shadow-xl">
          <DataRail label="ACTIVE CONTENDERS" value="12,403" trend="up" />
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-8 right-6 md:right-12 lg:right-24 hidden md:block z-10"
        variants={railVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-end bg-background/40 backdrop-blur-md border border-surface-border p-4 rounded-lg shadow-xl text-right">
          <DataRail label="NEXT TOURNAMENT" value="COMING SOON" />
        </div>
      </motion.div>

    </section>
  )
}
