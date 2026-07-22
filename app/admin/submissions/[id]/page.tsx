"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { getSubmissionById } from "@/actions/admin"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Loader2, ArrowLeft, Code2, ExternalLink, Video, Calendar, User, Mail } from "lucide-react"
import { Submission } from "@/lib/types"

export default function SubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = React.useState<Submission | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (!params.id) return
    getSubmissionById(params.id as string).then((res) => {
      if (res.error || !res.data) setError(res.error || "Submission not found")
      else setData(res.data as unknown as Submission)
      setLoading(false)
    })
  }, [params.id])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-accent-violet" size={40} />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-4xl mx-auto pt-8 px-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 font-mono text-sm">
          <ArrowLeft size={16} /> Back to Submissions
        </button>
        <div className="bg-surface border border-red-500/30 rounded-xl p-12 text-center">
          <p className="text-red-400 font-mono">{error || "Submission not found"}</p>
        </div>
      </div>
    )
  }

  const statusVariant = data.status === "submitted" ? "gold" : data.status === "evaluated" ? "violet" : "default"
  const statusLabel = data.status === "submitted" ? "Pending Review" : data.status === "evaluated" ? "Reviewed" : data.status === "draft" ? "Draft" : data.status

  return (
    <div className="w-full max-w-4xl mx-auto pt-8 px-4 pb-12">
      {/* Back Button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 font-mono text-sm">
        <ArrowLeft size={16} /> Back to Submissions
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <h1 className="text-3xl font-heading font-bold text-text-primary">
            {data.project_name || "Untitled Project"}
          </h1>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
        {data.tagline && (
          <p className="text-text-secondary font-body text-lg">{data.tagline}</p>
        )}
      </motion.div>

      <div className="space-y-6">
        {/* Participant Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface border border-surface-border rounded-xl p-6"
        >
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-4 border-b border-surface-border pb-3">Participant Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-violet/10 text-accent-violet flex items-center justify-center">
                <User size={16} />
              </div>
              <div>
                <p className="text-xs text-text-muted font-mono">Name</p>
                <p className="text-text-primary font-medium">{data.participant_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-xs text-text-muted font-mono">Email</p>
                <p className="text-text-primary text-sm">{data.participant_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-xs text-text-muted font-mono">Submitted</p>
                <p className="text-text-primary text-sm font-mono">{data.submitted_at ? new Date(data.submitted_at).toLocaleString() : "Not yet"}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Project Description */}
        {data.description && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface border border-surface-border rounded-xl p-6"
          >
            <h2 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-4 border-b border-surface-border pb-3">Project Description</h2>
            <p className="text-text-primary leading-relaxed whitespace-pre-wrap">{data.description}</p>
          </motion.section>
        )}

        {/* Tech Stack */}
        {data.tech_stack && data.tech_stack.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-surface border border-surface-border rounded-xl p-6"
          >
            <h2 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-4 border-b border-surface-border pb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {data.tech_stack.map((tech: string, i: number) => (
                <span key={i} className="inline-flex items-center rounded-full border border-accent-violet/20 bg-accent-violet/10 text-accent-violet px-3 py-1.5 text-xs font-mono font-semibold">
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Project Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-surface-border rounded-xl p-6"
        >
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-4 border-b border-surface-border pb-3">Project Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.github_url && (
              <a href={data.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-background/50 border border-surface-border rounded-lg text-text-secondary hover:text-accent-violet hover:border-accent-violet/50 transition-all group">
                <Code2 size={20} className="group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-sm text-text-primary group-hover:text-accent-violet">GitHub Repo</p>
                  <p className="text-xs text-text-muted font-mono truncate max-w-[180px]">{data.github_url.replace('https://', '')}</p>
                </div>
              </a>
            )}
            {data.demo_url && (
              <a href={data.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-background/50 border border-surface-border rounded-lg text-text-secondary hover:text-accent-violet hover:border-accent-violet/50 transition-all group">
                <ExternalLink size={20} className="group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-sm text-text-primary group-hover:text-accent-violet">Live Demo</p>
                  <p className="text-xs text-text-muted font-mono truncate max-w-[180px]">{data.demo_url.replace('https://', '')}</p>
                </div>
              </a>
            )}
            {data.video_url && (
              <a href={data.video_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-background/50 border border-surface-border rounded-lg text-text-secondary hover:text-accent-violet hover:border-accent-violet/50 transition-all group">
                <Video size={20} className="group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-sm text-text-primary group-hover:text-accent-violet">Demo Video</p>
                  <p className="text-xs text-text-muted font-mono truncate max-w-[180px]">{data.video_url.replace('https://', '')}</p>
                </div>
              </a>
            )}
          </div>
        </motion.section>

        {/* Additional Details */}
        {(data.key_features || data.challenges || data.future_improvements) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-surface border border-surface-border rounded-xl p-6 space-y-6"
          >
            <h2 className="text-sm font-mono text-text-muted uppercase tracking-wider border-b border-surface-border pb-3">Additional Details</h2>
            
            {data.key_features && (
              <div>
                <p className="text-xs font-mono text-accent-gold uppercase tracking-wider mb-2">Key Features</p>
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">{data.key_features}</p>
              </div>
            )}
            {data.challenges && (
              <div>
                <p className="text-xs font-mono text-red-400 uppercase tracking-wider mb-2">Challenges Faced</p>
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">{data.challenges}</p>
              </div>
            )}
            {data.future_improvements && (
              <div>
                <p className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">Future Improvements</p>
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">{data.future_improvements}</p>
              </div>
            )}
          </motion.section>
        )}

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-mono text-text-muted text-center pt-4 space-x-4"
        >
          <span>ID: {data.id}</span>
          {data.updated_at && <span>Last Updated: {new Date(data.updated_at).toLocaleString()}</span>}
        </motion.div>
      </div>
    </div>
  )
}
