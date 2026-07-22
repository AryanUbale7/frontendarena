"use client"

import * as React from "react"
import { SubmissionForm } from "@/components/dashboard/SubmissionForm"
import { SubmissionSubmittedCard } from "@/components/dashboard/SubmissionSubmittedCard"
import { Submission } from "@/lib/types"

interface SubmissionSectionClientProps {
  teamId: string
  trackId: string
  initialSubmission: Submission | null
  submissionsOpen: boolean
}

export function SubmissionSectionClient({ teamId, trackId, initialSubmission, submissionsOpen }: SubmissionSectionClientProps) {
  const [submission, setSubmission] = React.useState<Submission | null>(initialSubmission)

  if (submission) {
    return <SubmissionSubmittedCard submission={submission} />
  }

  if (!submissionsOpen) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6 text-center space-y-6 bg-surface border border-surface-border rounded-2xl p-8 md:p-12">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-red-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6v2m0-8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wide">
          Submissions Closed
        </h2>
        <p className="text-text-secondary font-body max-w-md mx-auto">
          The project submission window has been closed by the event administrators. No new submissions or modifications are accepted at this time.
        </p>
      </div>
    )
  }

  return (
    <SubmissionForm 
      teamId={teamId}
      trackId={trackId}
      onSuccess={(sub) => setSubmission(sub)}
    />
  )
}
