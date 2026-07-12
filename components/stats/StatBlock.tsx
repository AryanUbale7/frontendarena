"use client"

import * as React from "react"
import { motion, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

export interface StatBlockProps {
  number: string
  label: string
  className?: string
}

export function StatBlock({ number, label, className }: StatBlockProps) {
  const monumentTransition = {
    type: "spring" as const,
    damping: 20,
    stiffness: 100,
    mass: 1,
  }

  // Define variants to orchestrate the specific sequence
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  }

  // The number fades to 40% first (handled by initial render state after container fades up)
  // then animates to 100% after the underline draws.
  const numberVariants: Variants = {
    hidden: { opacity: 0.4 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.4, duration: 0.5, ease: "easeOut" } // Delayed to happen with/after underline
    }
  }

  const underlineVariants: Variants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: monumentTransition
    }
  }

  return (
    <motion.div 
      className={cn("flex flex-col items-start gap-4", className)}
      variants={containerVariants}
    >
      <motion.div 
        className="text-[clamp(3.5rem,8vw,6rem)] font-heading font-bold text-text-primary"
        variants={numberVariants}
      >
        {number}
      </motion.div>
      
      <div className="w-full h-px bg-surface-border relative">
        <motion.div 
          className="absolute inset-0 bg-accent-gold origin-left shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          variants={underlineVariants}
        />
      </div>
      
      <div className="text-xl md:text-2xl font-body text-text-secondary uppercase tracking-widest">
        {label}
      </div>
    </motion.div>
  )
}
