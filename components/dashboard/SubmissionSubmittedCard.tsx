"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Lock, Code2 as Github, ExternalLink, Calendar, CheckCircle2, Terminal } from "lucide-react"

interface SubmissionSubmittedCardProps {
  submission: {
    project_name: string
    tagline?: string
    description?: string
    tech_stack?: string[]
    github_url?: string
    demo_url?: string
    video_url?: string
    challenges?: string
    key_features?: string
    future_improvements?: string
    submitted_at?: string
  }
}

export function SubmissionSubmittedCard({ submission }: SubmissionSubmittedCardProps) {
  const submittedDate = submission.submitted_at
    ? new Date(submission.submitted_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Date Unknown"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-surface border border-surface-border rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
    >
      {/* Muted background pulse */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-surface-border pb-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center text-green-400 shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary uppercase tracking-wide">
              Submission Confirmed
            </h1>
            <p className="text-text-secondary font-body mt-1">
              You've already submitted for this track.
            </p>
          </div>
        </div>

        {/* Locked Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-mono uppercase tracking-wider self-start md:self-center">
          <Lock size={12} />
          Locked & Finalized
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Project info column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-white mb-2">{submission.project_name}</h2>
            {submission.tagline && (
              <p className="text-text-secondary font-body italic text-sm mb-4">{submission.tagline}</p>
            )}
            {submission.description && (
              <p className="text-text-secondary font-body text-sm leading-relaxed whitespace-pre-wrap">{submission.description}</p>
            )}
          </div>

          {submission.tech_stack && submission.tech_stack.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">Technologies</span>
              <div className="flex flex-wrap gap-2">
                {submission.tech_stack.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded bg-surface-hover border border-surface-border text-xs text-text-secondary font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional details */}
          {(submission.challenges || submission.key_features) && (
            <div className="border-t border-surface-border pt-6 space-y-6">
              {submission.key_features && (
                <div>
                  <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Key Features</h3>
                  <p className="text-text-secondary font-body text-sm leading-relaxed whitespace-pre-wrap">{submission.key_features}</p>
                </div>
              )}
              {submission.challenges && (
                <div>
                  <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Challenges Faced</h3>
                  <p className="text-text-secondary font-body text-sm leading-relaxed whitespace-pre-wrap">{submission.challenges}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Links and Metadata column */}
        <div className="space-y-6 bg-background/50 border border-surface-border rounded-xl p-6 h-fit">
          <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider pb-3 border-b border-surface-border">
            Submission Deliverables
          </h3>

          <div className="space-y-4">
            {submission.github_url && (
              <div className="space-y-1">
                <span className="text-xs text-text-muted font-mono block">GitHub Repository</span>
                <a
                  href={submission.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent-violet hover:underline break-all font-mono"
                >
                  <Github size={14} className="shrink-0" />
                  Codebase <ExternalLink size={12} />
                </a>
              </div>
            )}

            {submission.demo_url && (
              <div className="space-y-1">
                <span className="text-xs text-text-muted font-mono block">Live Demo</span>
                <a
                  href={submission.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-400 hover:underline break-all font-mono"
                >
                  <ExternalLink size={14} className="shrink-0" />
                  Live Site <ExternalLink size={12} />
                </a>
              </div>
            )}

            {submission.video_url && (
              <div className="space-y-1">
                <span className="text-xs text-text-muted font-mono block">Demo Video</span>
                <a
                  href={submission.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent-gold hover:underline break-all font-mono"
                >
                  <Terminal size={14} className="shrink-0" />
                  Watch Demo <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-surface-border pt-4 mt-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Calendar size={14} className="text-text-muted shrink-0" />
              <span>
                Submitted: <strong className="text-white font-mono">{submittedDate}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
