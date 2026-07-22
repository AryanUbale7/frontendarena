"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { z } from "zod"

const urlSchema = z.union([z.literal(""), z.string().url()]).optional()

const SubmissionSchema = z.object({
  projectName: z.string().min(1, "Project name is required").max(100),
  tagline: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  githubUrl: urlSchema,
  demoUrl: urlSchema,
  videoUrl: urlSchema,
  techStack: z.string().optional(),
  challenges: z.string().max(2000).optional(),
  keyFeatures: z.string().max(2000).optional(),
  futureImprovements: z.string().max(2000).optional(),
})

const FinalSubmitSchema = SubmissionSchema.extend({
  projectName: z.string().min(1, "Project name is required").max(100),
  githubUrl: z.string().url("Valid GitHub URL is required"),
  declaration: z.literal("on", { message: "You must agree to the declaration" }),
})

export async function saveDraft(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const rateLimitKey = `rate_limit:user:${user.id}:submissions`
  const limitCheck = await checkRateLimit(rateLimitKey, 20, 3600)
  if (!limitCheck.allowed) {
    return { error: "Submission rate limit exceeded. Please try again in an hour." }
  }

  // Get active event ID
  const { data: activeEvent } = await supabase.from('events').select('id').eq('status', 'active').single()
  const eventId = activeEvent?.id || '00000000-0000-0000-0000-000000000000'

  // Fetch the user's team and track registration
  const { data: memberData, error: memberErr } = await supabase
    .from("team_members")
    .select(`
      team_id,
      teams (
        track_id
      )
    `)
    .eq("user_id", user.id)
    .maybeSingle()

  if (memberErr) {
    return { error: memberErr.message }
  }
  if (!memberData || !memberData.team_id || !memberData.teams) {
    return { error: "You must register for a track first before submitting." }
  }

  const teamId = memberData.team_id
  const teamsObj = memberData.teams as unknown as { track_id: string } | Array<{ track_id: string }>
  const trackId = Array.isArray(teamsObj) ? teamsObj[0]?.track_id : teamsObj?.track_id

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
    return { error: parsed.error.issues[0].message }
  }

  const data = parsed.data

  // INSERT submission (upsert is avoided since locked policy prevents updates)
  const { error } = await supabase
    .from("submissions")
    .insert({
      participant_id: user.id,
      event_id: eventId,
      team_id: teamId,
      track_id: trackId,
      status: "draft",
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
      updated_at: new Date().toISOString()
    })

  if (error) {
    if (error.code === "23505") {
      return { error: "Your team has already submitted a project for this track. Only one submission is allowed." }
    }
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function finalSubmit(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const rateLimitKey = `rate_limit:user:${user.id}:submissions`
  const limitCheck = await checkRateLimit(rateLimitKey, 20, 3600)
  if (!limitCheck.allowed) {
    return { error: "Submission rate limit exceeded. Please try again in an hour." }
  }

  const { data: activeEvent } = await supabase.from('events').select('id').eq('status', 'active').single()
  const eventId = activeEvent?.id || '00000000-0000-0000-0000-000000000000'

  // Fetch the user's team and track registration
  const { data: memberData, error: memberErr } = await supabase
    .from("team_members")
    .select(`
      team_id,
      teams (
        track_id
      )
    `)
    .eq("user_id", user.id)
    .maybeSingle()

  if (memberErr) {
    return { error: memberErr.message }
  }
  if (!memberData || !memberData.team_id || !memberData.teams) {
    return { error: "You must register for a track first before submitting." }
  }

  const teamId = memberData.team_id
  const teamsObj = memberData.teams as unknown as { track_id: string } | Array<{ track_id: string }>
  const trackId = Array.isArray(teamsObj) ? teamsObj[0]?.track_id : teamsObj?.track_id

  const parsed = FinalSubmitSchema.safeParse({
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
    declaration: formData.get("declaration"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const data = parsed.data

  // INSERT final submission
  const { error } = await supabase
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

  if (error) {
    if (error.code === "23505") {
      return { error: "Your team has already submitted a project for this track. Only one submission is allowed." }
    }
    return { error: error.message }
  }

  revalidateTag("homepage-data")
  revalidateTag("hall-of-fame-list")
  revalidatePath("/dashboard")
  return { success: true, redirect: "/submission/success" }
}

export async function getMySubmission() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: activeEvent } = await supabase.from('events').select('id').eq('status', 'active').single()
  const eventId = activeEvent?.id || '00000000-0000-0000-0000-000000000000'

  const { data, error } = await supabase
    .from("submissions")
    .select("id, project_name, tagline, description, tech_stack, github_url, demo_url, video_url, challenges, key_features, future_improvements, status, submitted_at")
    .eq("participant_id", user.id)
    .eq("event_id", eventId)
    .single()

  if (error) return { error: error.message }
  return { data }
}
