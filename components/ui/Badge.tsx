import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "violet" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-surface-hover text-text-primary border-surface-border",
    gold: "bg-accent-gold/10 text-accent-gold border-accent-gold/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    violet: "bg-accent-violet/10 text-accent-violet border-accent-violet/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]",
    outline: "border-surface-border text-text-secondary",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-violet focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
