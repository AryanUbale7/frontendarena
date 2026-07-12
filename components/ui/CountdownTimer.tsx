"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CountdownTimerProps {
  targetDate?: Date
  className?: string
  hideSeconds?: boolean
}

// Helper to pad numbers
const pad = (num: number) => num.toString().padStart(2, '0')

function AnimatedDigit({ digit, label }: { digit: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden h-12 w-16 md:h-16 md:w-20 bg-surface border border-surface-border rounded flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={digit}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }} // Live easing
            className="absolute text-3xl md:text-5xl font-mono font-bold text-text-primary tabular-nums"
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-xs font-mono text-text-muted uppercase tracking-widest">{label}</span>
    </div>
  )
}

export function CountdownTimer({ 
  targetDate: initialTargetDate, 
  className,
  hideSeconds = false
}: CountdownTimerProps) {
  
  // Memoize target date so it doesn't move forward on every tick/re-render
  const targetDate = React.useMemo(() => {
    return initialTargetDate || new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
  }, [initialTargetDate])
  
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  // Prevent hydration mismatch by only rendering actual times after mount
  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <AnimatedDigit digit="00" label="Days" />
        <span className="text-2xl text-surface-border font-mono pb-6">:</span>
        <AnimatedDigit digit="00" label="Hours" />
        <span className="text-2xl text-surface-border font-mono pb-6">:</span>
        <AnimatedDigit digit="00" label="Mins" />
        {!hideSeconds && (
          <>
            <span className="text-2xl text-surface-border font-mono pb-6">:</span>
            <AnimatedDigit digit="00" label="Secs" />
          </>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2 md:gap-4", className)}>
      <AnimatedDigit digit={pad(timeLeft.days)} label="Days" />
      <span className="text-2xl text-surface-border font-mono pb-6">:</span>
      
      <AnimatedDigit digit={pad(timeLeft.hours)} label="Hours" />
      <span className="text-2xl text-surface-border font-mono pb-6">:</span>
      
      <AnimatedDigit digit={pad(timeLeft.minutes)} label="Mins" />
      
      {!hideSeconds && (
        <>
          <span className="text-2xl text-surface-border font-mono pb-6">:</span>
          <AnimatedDigit digit={pad(timeLeft.seconds)} label="Secs" />
        </>
      )}
    </div>
  )
}
