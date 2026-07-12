"use client"

import * as React from "react"
import { motion, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

export function HeroHeadline({ className }: { className?: string }) {
  // Monument easing: powerful, authoritative, slightly stiff spring
  const monumentTransition = {
    type: "spring" as const,
    damping: 20,
    stiffness: 100,
    mass: 1,
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15, // 150ms stagger
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      rotateX: 20,
      filter: "blur(8px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: monumentTransition
    }
  }

  return (
    <motion.div 
      className={cn("flex flex-col font-heading font-bold uppercase tracking-tighter text-[clamp(3rem,9vw,7.5rem)]", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ perspective: 1000 }}
    >
      <motion.span variants={itemVariants} className="text-text-primary">
        Code
      </motion.span>
      <motion.span variants={itemVariants} className="text-accent-gold">
        Survive
      </motion.span>
      <motion.span variants={itemVariants} className="text-text-primary">
        Conquer
      </motion.span>
    </motion.div>
  )
}
