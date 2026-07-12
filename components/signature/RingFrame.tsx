"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

export interface RingFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "winner" | "judge"
  children: React.ReactNode
  enableTrace?: boolean
  onTraceComplete?: () => void
}

export function RingFrame({ 
  className, 
  variant = "default", 
  children, 
  enableTrace = false,
  onTraceComplete,
  ...props 
}: RingFrameProps) {
  const isWinner = variant === "winner"
  const isJudge = variant === "judge"
  
  const ringColor = isWinner 
    ? "#F59E0B" 
    : isJudge
      ? "#A1A1AA"
      : "#8B5CF6"
      
  const glowColor = isWinner
    ? "rgba(245,158,11,0.5)"
    : isJudge
      ? "rgba(161,161,170,0.3)"
      : "rgba(139,92,246,0.3)"

  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <div 
      ref={ref}
      className={cn("relative inline-flex items-center justify-center p-3", className)}
      {...props}
    >
      {/* SVG Frame Boundary */}
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        {enableTrace ? (
          <motion.circle
            cx="50%"
            cy="50%"
            r="calc(50% - 2px)"
            fill="none"
            stroke={ringColor}
            strokeWidth="2"
            strokeDasharray={isWinner ? "4 8" : "none"}
            style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}
            initial={{ pathLength: 0, rotate: -90 }}
            animate={isInView ? { pathLength: 1, rotate: isWinner ? [-90, 270] : -90 } : { pathLength: 0, rotate: -90 }}
            transition={{
              pathLength: { duration: 1.5, ease: "easeInOut" },
              rotate: isWinner ? { duration: 10, repeat: Infinity, ease: "linear", delay: 1.5 } : {}
            }}
            onAnimationComplete={(definition) => {
              if (definition === "pathLength" || (typeof definition === 'object' && !Array.isArray(definition) && (definition as any).pathLength)) {
                onTraceComplete?.()
              }
            }}
          />
        ) : (
          <motion.circle
            cx="50%"
            cy="50%"
            r="calc(50% - 2px)"
            fill="none"
            stroke={ringColor}
            strokeWidth="2"
            strokeDasharray={isWinner ? "4 8" : "none"}
            style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}
            animate={isWinner ? { rotate: 360 } : {}}
            transition={isWinner ? { duration: 10, repeat: Infinity, ease: "linear" } : {}}
          />
        )}
      </svg>
      
      {/* Content Container */}
      <div className="relative z-10 rounded-full overflow-hidden bg-surface-border">
        {children}
      </div>
      
      {/* Winner specific adornments */}
      {isWinner && (
        <motion.div
          initial={enableTrace ? { scale: 0, opacity: 0 } : { scale: 0.8, opacity: 0 }}
          animate={(!enableTrace || isInView) ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ delay: enableTrace ? 1.5 : 0.5, type: "spring" }}
          className="absolute -top-1 right-0 z-20 text-accent-gold text-2xl drop-shadow-[0_0_10px_rgba(245,158,11,1)]"
        >
          ✦
        </motion.div>
      )}
    </div>
  )
}
