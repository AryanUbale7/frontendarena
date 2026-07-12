"use client"

import * as React from "react"
import { generateSignedDownloadUrl } from "@/actions/problem-statements"
import { FileText, Download, Loader2, Calendar, HardDrive } from "lucide-react"

interface StatementCardProps {
  statement: {
    id: string
    title: string
    description?: string
    file_name: string
    file_size: number
    file_url: string
    published_at?: string
  }
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function ProblemStatementCard({ statement }: StatementCardProps) {
  const [downloading, setDownloading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleDownload = async () => {
    setDownloading(true)
    setError("")

    try {
      const res = await generateSignedDownloadUrl(statement.file_url)
      if (res.error) {
        setError(res.error)
      } else if (res.signedUrl) {
        // Open the signed download URL in a new tab
        window.open(res.signedUrl, "_blank")
      }
    } catch (err: any) {
      setError("An unexpected error occurred.")
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="p-6 bg-surface border border-surface-border rounded-xl flex flex-col justify-between gap-6 shadow-lg hover:border-accent-gold/40 transition-colors relative overflow-hidden group">
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent-gold/10 flex items-center justify-center text-accent-gold flex-shrink-0">
            <FileText size={20} />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <h4 className="font-heading font-bold text-white text-base leading-snug truncate" title={statement.title}>
              {statement.title}
            </h4>
            <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted uppercase w-full">
              <span className="flex items-center gap-1 min-w-0 max-w-full">
                <HardDrive size={10} className="flex-shrink-0" />
                <span className="truncate">{statement.file_name}</span>
                <span className="flex-shrink-0">({formatBytes(statement.file_size)})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {statement.description && (
          <p className="text-sm text-text-secondary font-body leading-relaxed line-clamp-3">
            {statement.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-surface-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="font-mono text-xs text-text-muted flex items-center gap-1">
          <Calendar size={12} />
          Released: {statement.published_at ? new Date(statement.published_at).toLocaleDateString() : "Pending"}
        </span>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full sm:w-auto px-4 py-2 rounded bg-accent-gold text-[#0A0A0A] font-bold text-xs flex items-center justify-center gap-2 hover:bg-accent-gold/90 active:scale-[0.98] transition-colors disabled:opacity-50"
        >
          {downloading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Download size={12} />
          )}
          Download File
        </button>
      </div>

      {error && (
        <div className="absolute inset-x-0 bottom-0 bg-red-500/90 text-white font-mono text-[10px] px-3 py-1.5 text-center">
          {error}
        </div>
      )}
    </div>
  )
}
