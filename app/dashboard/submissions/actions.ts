"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const urlSchema = z.union([z.literal(""), z.string().url()]).optional()

const SubmissionSchema = z.object({
  projectName: z.string().min(1, "Project name is required").max(100),
  tagline: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  githubUrl: z.string().url("Valid GitHub URL is required"),
  demoUrl: urlSchema,
  videoUrl: urlSchema,
  techStack: z.string().optional(),
  challenges: z.string().max(2000).optional(),
  keyFeatures: z.string().max(2000).optional(),
  futureImprovements: z.string().max(2000).optional(),
})

/**
 * Creates a new project submission for a team and track.
 * Enforces one-time-only submission by checking beforehand and catching unique constraint violations.
 */
export async function createSubmission(teamId: string, trackId: string, formData: FormData) {
  const supabase = await createClient()

  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Rate limiting to prevent abuse
  const ip = await getClientIp()
  const rateLimitKey = `rate_limit:ip:${ip}:create_submission`
  const limitCheck = await checkRateLimit(rateLimitKey, 5, 60)
  if (!limitCheck.allowed) {
    return { success: false, error: "Too many submission attempts. Please wait a minute." }
  }

  // 1.5. Check if submissions are open for the active event
  const { data: eventData, error: eventErr } = await supabase
    .from("events")
    .select("submissions_open")
    .eq("status", "active")
    .maybeSingle()

  if (eventErr) {
    return { success: false, error: eventErr.message }
  }

  if (eventData && eventData.submissions_open === false) {
    return { success: false, error: "Submissions have been closed by the event administrators." }
  }

  // 2. Query whether a submission already exists for this team_id + track_id
  const { data: existingSubmission, error: fetchError } = await supabase
    .from("submissions")
    .select("id, project_name, status, submitted_at, locked")
    .eq("team_id", teamId)
    .eq("track_id", trackId)
    .maybeSingle()

  if (fetchError) {
    return { success: false, error: fetchError.message }
  }

  if (existingSubmission) {
    return {
      success: false,
      reason: "already_submitted",
      existingSubmission
    }
  }

  // 3. Parse and validate form data
  const parsed = SubmissionSchema.safeParse({
    projectName: formData.get("projectName"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    githubUrl: formData.get("githubUrl"),
    demoUrl: formData.get("demoUrl"),
    videoUrl: formData.get("videoUrl"),
    techStack: formData.get("techStack"),
    challenges: formData.get("challenges"),
    keyFeatures: formData.get("keyFeatures"),
    futureImprovements: formData.get("futureImprovements"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const data = parsed.data
  const eventId = "00000000-0000-0000-0000-000000000000" // active event placeholder

  // 4. Perform database insert
  const { data: newSubmission, error: insertError } = await supabase
    .from("submissions")
    .insert({
      participant_id: user.id,
      event_id: eventId,
      team_id: teamId,
      track_id: trackId,
      status: "submitted",
      project_name: data.projectName,
      tagline: data.tagline,
      description: data.description,
      github_url: data.githubUrl,
      demo_url: data.demoUrl,
      video_url: data.videoUrl,
      tech_stack: (data.techStack || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      challenges: data.challenges,
      key_features: data.keyFeatures,
      future_improvements: data.futureImprovements,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select("id, project_name, status, submitted_at, locked")
    .maybeSingle()

  if (insertError) {
    // Catch unique constraint violation error code 23505
    if (insertError.code === "23505") {
      // Re-fetch to return the existing submission in the expected shape
      const { data: refetchedSubmission } = await supabase
        .from("submissions")
        .select("id, project_name, status, submitted_at, locked")
        .eq("team_id", teamId)
        .eq("track_id", trackId)
        .maybeSingle()

      return {
        success: false,
        reason: "already_submitted",
        existingSubmission: refetchedSubmission || { id: "unknown" }
      }
    }
    return { success: false, error: insertError.message }
  }

  // 5. Revalidate relevant path so the UI immediately reflects the new locked state without refresh
  revalidatePath("/dashboard")
  revalidatePath("/submission")
  revalidateTag("homepage-data")
  revalidateTag("hall-of-fame-list")

  return { success: true, submission: newSubmission }
}
