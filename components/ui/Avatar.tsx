import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback: string
  size?: "sm" | "md" | "lg" | "xl"
}

function Avatar({ className, src, alt, fallback, size = "md", ...props }: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
    xl: "h-20 w-20 text-lg",
  }

  // Exact image pixel widths per breakpoint for Next.js image loading optimization
  const nextImageWidths = {
    sm: "32px",
    md: "48px",
    lg: "64px",
    xl: "80px",
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-surface-border",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || "Avatar"}
          fill
          sizes={nextImageWidths[size]}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-heading font-medium text-text-primary">
          {fallback}
        </div>
      )}
    </div>
  )
}

export { Avatar }
