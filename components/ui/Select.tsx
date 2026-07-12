"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-12 w-full appearance-none rounded-md border border-surface-border bg-surface px-4 py-2 pr-10 text-sm font-body text-text-primary transition-colors",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-violet focus-visible:border-accent-violet",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {/* Custom Chevron Icon */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center px-2 text-text-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"
