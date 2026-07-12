import * as React from "react"
import { cn } from "@/lib/utils"

export interface DataRailProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | React.ReactNode
  trend?: "up" | "down" | "neutral"
}

function DataRail({ className, label, value, trend, ...props }: DataRailProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-surface-border py-3 text-sm",
        className
      )}
      {...props}
    >
      <span className="font-mono text-text-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-heading font-medium text-text-primary">{value}</span>
        {trend === "up" && <span className="text-status-success font-mono">↑</span>}
        {trend === "down" && <span className="text-status-error font-mono">↓</span>}
      </div>
    </div>
  )
}

export { DataRail }
