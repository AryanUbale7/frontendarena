import * as React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SubmissionSectionClient } from "./SubmissionSectionClient"
import { AlertCircle } from "lucide-react"

export default async function SubmissionsDashboardPage() {
  const supabase = await createClient()

  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // 2. Query user's team and track registration
  const { data: memberData, error: memberErr } = await supabase
    .from("team_members")
    .select(`
      team_id,
      teams (
        name,
        track_id,
        tracks (
          name
        )
      )
    `)
    .eq("user_id", user.id)
    .maybeSingle()

  if (memberErr) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-sm max-w-lg mx-auto mt-12 flex items-center gap-3">
        <AlertCircle size={20} className="shrink-0" />
        <span>Failed to fetch registration data: {memberErr.message}</span>
      </div>
    )
  }

  const teamId = memberData?.team_id
  const teamsData = memberData?.teams as any
  const teamName = teamsData?.name
  const trackId = teamsData?.track_id
  const trackName = teamsData?.tracks?.name

  // If user is not registered in a team/track
  if (!teamId || !trackId) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-16 text-center space-y-6 bg-surface border border-surface-border rounded-2xl p-8 md:p-12">
        <div className="w-16 h-16 bg-accent-violet/10 border border-accent-violet/20 rounded-2xl flex items-center justify-center mx-auto text-accent-violet">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-wide">
          Not Registered
        </h1>
        <p className="text-text-secondary font-body max-w-md mx-auto">
          You must register for a specific track first before submitting your project deliverables. Go to your Dashboard to browse the available problem statements.
        </p>
      </div>
    )
  }

  // 3. Fetch existing submission for their team_id + track_id
  const { data: existingSubmission } = await supabase
    .from("submissions")
    .select("id, project_name, tagline, description, tech_stack, github_url, demo_url, video_url, challenges, key_features, future_improvements, status, submitted_at, locked")
    .eq("team_id", teamId)
    .eq("track_id", trackId)
    .maybeSingle()

  // 4. Fetch submissions open status
  const { data: eventData } = await supabase
    .from("events")
    .select("submissions_open")
    .eq("status", "active")
    .maybeSingle()

  const submissionsOpen = eventData?.submissions_open ?? true

  return (
    <div className="w-full h-full flex flex-col gap-8 pb-12">
      <div className="border-b border-surface-border pb-6">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2 uppercase tracking-wide">
          Project Submission
        </h1>
        <p className="text-text-secondary font-body">
          Track: <strong className="text-accent-gold font-mono">{trackName}</strong> | Team: <strong className="text-white font-mono">{teamName}</strong>
        </p>
      </div>

      <SubmissionSectionClient 
        teamId={teamId}
        trackId={trackId}
        initialSubmission={existingSubmission}
        submissionsOpen={submissionsOpen}
      />
    </div>
  )
}
