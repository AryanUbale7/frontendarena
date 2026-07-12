import * as React from "react"

export default function AdminLoading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      {/* Violet spinning ring matching the admin layout colors */}
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border border-surface-border/60" />
        <div className="absolute inset-0 rounded-full border border-t-accent-violet border-r-accent-violet animate-spin" />
      </div>
      <div className="font-mono text-xs text-text-muted uppercase tracking-[0.2em] animate-pulse">
        Retrieving Console Data...
      </div>
    </div>
  )
}
