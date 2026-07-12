"use client"

import * as React from "react"
import { motion, useTransform, MotionValue, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

export interface RiftRingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "violet" | "gold"
  size?: number
  interactive?: boolean
  scrollProgress?: MotionValue<number> // 0 to 1
}

export function RiftRing({ 
  className, 
  variant = "violet", 
  size = 400,
  interactive = false,
  scrollProgress,
  ...props 
}: RiftRingProps) {
  
  // Base colors mapped to tokens
  const goldColor = "#F59E0B"
  const violetColor = "#8B5CF6"
  
  const fallbackScroll = useMotionValue(0)

  // If scrollProgress is provided (typically scrollY), interpolate from gold to violet over 400px.
  // Otherwise, fallback to static variant color.
  const animatedColor = useTransform(
    scrollProgress || fallbackScroll, 
    [0, 400], 
    [goldColor, violetColor]
  )

  const strokeColor = scrollProgress 
    ? animatedColor 
    : (variant === "gold" ? goldColor : violetColor)

  const animatedColorGlow = useTransform(
    scrollProgress || fallbackScroll,
    [0, 400],
    ["rgba(245,158,11,0.4)", "rgba(139,92,246,0.4)"]
  )

  const strokeColorGlow = scrollProgress
    ? animatedColorGlow
    : (variant === "gold" ? "rgba(245,158,11,0.4)" : "rgba(139,92,246,0.4)")

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {/* Background Glow - Using div for better performance than SVG feGaussianBlur */}
      <motion.div
        className="absolute inset-1/4 rounded-full blur-[60px]"
        style={{ backgroundColor: strokeColor }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={cn(
          "relative z-10 overflow-visible",
          // Idle rotation on desktop, static on mobile (guardrail)
          "lg:animate-[spin_90s_linear_infinite]" 
        )}
      >
        {/* Inner Solid Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth="0.5"
          style={{ stroke: strokeColor }}
          className="opacity-50"
        />

        {/* Outer Filament Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          style={{ stroke: strokeColor, filter: `drop-shadow(0 0 10px ${strokeColorGlow})` }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ 
            duration: 0.9, // ~900ms stagger-resolve
            ease: "easeOut",
            delay: 0.2
          }}
        />

        {/* Interactive Highlight Ring (only if interactive) */}
        {interactive && (
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            strokeWidth="2"
            strokeDasharray="30 100"
            style={{ stroke: strokeColor, transformOrigin: "50px 50px" }}
            animate={{ 
              rotate: 360,
              strokeDasharray: ["30 100", "60 100", "30 100"] 
            }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              strokeDasharray: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        )}
      </svg>
    </div>
  )
}
