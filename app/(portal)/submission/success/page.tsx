"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { CheckCircle2, ChevronRight, ExternalLink, Code2, Video, Loader2 } from "lucide-react"
import { getMySubmission } from "@/actions/submissions"

export default function SubmissionSuccessPage() {
  const [submission, setSubmission] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    getMySubmission().then((res) => {
      if (res.data) setSubmission(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-violet" size={40} />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface/80 backdrop-blur-md border border-surface-border rounded-2xl p-10 max-w-3xl w-full relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={48} />
          </motion.div>

          <h1 className="text-4xl font-heading font-bold text-white mb-3">Submission Successful!</h1>
          <p className="text-text-secondary font-body">
            Your project has been securely submitted to the Frontend Wars 2026 arena. It is now locked for review by the judges.
          </p>
        </div>

        {/* Submission Details */}
        {submission && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 relative z-10"
          >
            {/* Project Info Card */}
            <div className="bg-background/50 border border-surface-border rounded-xl p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField label="Status" value="Submitted Successfully" valueClass="text-green-400 font-medium" />
                <InfoField label="Submission ID" value={`FWAR-${submission.id.split('-')[0].toUpperCase()}`} mono />
                <InfoField label="Project Name" value={submission.project_name || "—"} />
                <InfoField label="Submitted At" value={submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : "—"} mono />
              </div>

              {submission.tagline && (
                <InfoField label="Tagline" value={submission.tagline} />
              )}

              {submission.description && (
                <div>
                  <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1.5">Description</p>
                  <p className="text-text-primary text-sm leading-relaxed">{submission.description}</p>
                </div>
              )}

              {/* Tech Stack */}
              {submission.tech_stack && submission.tech_stack.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {submission.tech_stack.map((tech: string, i: number) => (
                      <span key={i} className="inline-flex items-center rounded-full border border-accent-violet/20 bg-accent-violet/10 text-accent-violet px-3 py-1 text-xs font-mono font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {submission.github_url && (
                <a href={submission.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-background/50 border border-surface-border rounded-lg text-sm text-text-secondary hover:text-accent-violet hover:border-accent-violet/50 transition-colors font-mono">
                  <Code2 size={16} /> GitHub Repo
                </a>
              )}
              {submission.demo_url && (
                <a href={submission.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-background/50 border border-surface-border rounded-lg text-sm text-text-secondary hover:text-accent-violet hover:border-accent-violet/50 transition-colors font-mono">
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
              {submission.video_url && (
                <a href={submission.video_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-background/50 border border-surface-border rounded-lg text-sm text-text-secondary hover:text-accent-violet hover:border-accent-violet/50 transition-colors font-mono">
                  <Video size={16} /> Demo Video
                </a>
              )}
            </div>

            {/* Additional Info */}
            {(submission.challenges || submission.key_features || submission.future_improvements) && (
              <div className="bg-background/50 border border-surface-border rounded-xl p-6 space-y-4">
                {submission.key_features && (
                  <div>
                    <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1.5">Key Features</p>
                    <p className="text-text-primary text-sm">{submission.key_features}</p>
                  </div>
                )}
                {submission.challenges && (
                  <div>
                    <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1.5">Challenges Faced</p>
                    <p className="text-text-primary text-sm">{submission.challenges}</p>
                  </div>
                )}
                {submission.future_improvements && (
                  <div>
                    <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1.5">Future Improvements</p>
                    <p className="text-text-primary text-sm">{submission.future_improvements}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 mt-10">
          <Button variant="secondary" asChild>
            <Link href="/dashboard">
              Return to Dashboard
            </Link>
          </Button>
          <Button variant="primary" asChild className="gap-2">
            <Link href="/sponsor-benefits">
              Claim Sponsor Benefits <ChevronRight size={18} />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

function InfoField({ label, value, mono, valueClass }: { label: string; value: string; mono?: boolean; valueClass?: string }) {
  return (
    <div>
      <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-text-primary ${mono ? "font-mono text-sm" : ""} ${valueClass || ""}`}>{value}</p>
    </div>
  )
}
