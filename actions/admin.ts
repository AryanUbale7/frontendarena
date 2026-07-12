"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { z } from "zod"

async function verifyAdminAccess() {
  const cookieStore = await cookies()
  if (cookieStore.get("admin_auth")?.value !== "true") {
    throw new Error("Unauthorized admin access")
  }
}

const UpdateEventContentSchema = z.object({
  problemStatement: z.string().min(1, "Problem statement is required"),
  starterKitLink: z.union([z.literal(""), z.string().url()]).optional(),
  figmaLink: z.union([z.literal(""), z.string().url()]).optional(),
  submissionsOpen: z.boolean().optional(),
})

export async function getAdminStats() {
  const supabase = await createClient()
  
  // Admin auth is handled by middleware via admin_auth cookie
  // Check role if you have it in users table, skipping for demo brevity.
  
  // Total participants
  const { count: participantsCount, error: err1 } = await supabase
    .from("users")
    .select("*", { count: 'exact', head: true })
  
  if (err1) console.error("Error fetching participants count:", err1.message)

  // Active Submissions
  const { count: submissionsCount, error: err2 } = await supabase
    .from("submissions")
    .select("*", { count: 'exact', head: true })
    
  if (err2) console.error("Error fetching submissions count:", err2.message)

  // Recent Submissions (mocking activity stream)
  const { data: recentSubmissions } = await supabase
    .from("submissions")
    .select(`
      id,
      project_name,
      status,
      updated_at,
      users ( full_name )
    `)
    .order("updated_at", { ascending: false })
    .limit(5)

  return {
    participantsCount: participantsCount || 0,
    submissionsCount: submissionsCount || 0,
    recentSubmissions: recentSubmissions || []
  }
}

export async function getAllSubmissions() {
  const supabase = await createClient()
  
  // Admin auth is handled by middleware via admin_auth cookie

  const { data, error } = await supabase
    .from("submissions")
    .select(`
      id,
      project_name,
      status,
      submitted_at,
      github_url,
      demo_url,
      users ( full_name, team_name )
    `)
    .order("submitted_at", { ascending: false, nullsFirst: false })

  if (error) {
    return { error: error.message }
  }

  const mapped = data.map((sub: any) => ({
    id: sub.id,
    user: sub.users?.team_name || sub.users?.full_name || "Unknown",
    track: "Arena", // Placeholder since track isn't implemented in submissions table yet
    status: sub.status === 'evaluated' ? 'Reviewed' : sub.status === 'submitted' ? 'Pending' : 'Draft',
    submitted: sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : "Draft",
    repo: sub.github_url || "",
    demo: sub.demo_url || ""
  }))

  return { data: mapped }
}

export async function getSubmissionById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("submissions")
    .select(`
      id,
      project_name,
      tagline,
      description,
      tech_stack,
      github_url,
      demo_url,
      video_url,
      challenges,
      key_features,
      future_improvements,
      status,
      submitted_at,
      updated_at,
      users ( full_name, team_name, email )
    `)
    .eq("id", id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return {
    data: {
      ...data,
      participant_name: (data as any).users?.team_name || (data as any).users?.full_name || "Unknown",
      participant_email: (data as any).users?.email || "N/A",
    }
  }
}

export async function getAllParticipants() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, team_name, email, created_at, role")
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  const mapped = data.map((user: any) => ({
    id: user.id.split('-')[0].toUpperCase(),
    name: user.team_name || user.full_name || "Unknown",
    email: user.email || "No email stored",
    joined: new Date(user.created_at).toLocaleDateString(),
    status: user.role === 'admin' ? "Admin" : "Active"
  }))

  return { data: mapped }
}

export async function getAllSponsorInquiries() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sponsor_inquiries")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getActiveEventContent() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("events")
    .select("id, name, problem_statement, starter_kit_link, figma_link, problem_statement_url, problem_statement_filename, resource_file_url, resource_file_filename, submissions_open")
    .eq("status", "active")
    .single()

  if (error) {
    return { error: error.message }
  }
  return { data }
}

import { revalidateTag, revalidatePath } from "next/cache"

export async function updateEventContent(formData: {
  problemStatement: string
  starterKitLink: string
  figmaLink: string
  submissionsOpen?: boolean
}) {
  try {
    await verifyAdminAccess()
  } catch (e: any) {
    return { error: e.message }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  const parsed = UpdateEventContentSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const { problemStatement, starterKitLink, figmaLink, submissionsOpen } = parsed.data

  const supabase = await createClient()

  // Get active event ID
  const { data: event, error: fetchError } = await supabase
    .from("events")
    .select("id")
    .eq("status", "active")
    .single()

  if (fetchError || !event) {
    return { error: "No active event found to update content." }
  }

  const { data, error } = await supabase
    .from("events")
    .update({
      problem_statement: problemStatement,
      starter_kit_link: starterKitLink,
      figma_link: figmaLink,
      submissions_open: submissionsOpen ?? true
    })
    .eq("id", event.id)
    .select()

  if (error) {
    return { error: error.message }
  }

  // Instantly invalidate caches so they reflect dynamically to all participants
  revalidateTag("event-detail")
  revalidatePath("/dashboard")
  revalidatePath("/resources")

  return { success: true, data }
}

export async function uploadEventFile(formData: FormData) {
  try {
    await verifyAdminAccess()
  } catch (e: any) {
    return { error: e.message }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  const file = formData.get("file") as File
  const fileType = formData.get("type") as "problem" | "resource"
  
  if (!file || file.size === 0) {
    return { error: "No file selected." }
  }

  // File size limit: 25MB
  if (file.size > 25 * 1024 * 1024) {
    return { error: "File exceeds 25MB limit." }
  }

  // Import node modules dynamically to avoid any client bundler leaks
  const fs = await import("fs")
  const path = await import("path")

  const buffer = Buffer.from(await file.arrayBuffer())
  
  // Sanitize filename strictly
  const rawFilename = path.basename(file.name).replace(/[^a-zA-Z0-9.\-_]/g, "_")
  const filename = `${Date.now()}-${rawFilename}`
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const filePath = path.join(uploadDir, filename)
  fs.writeFileSync(filePath, buffer)

  const fileUrl = `/uploads/${filename}`

  const supabase = await createClient()
  const { data: event, error: fetchError } = await supabase
    .from("events")
    .select("id")
    .eq("status", "active")
    .single()

  if (fetchError || !event) {
    return { error: "No active event found to link file." }
  }

  const updateFields: any = {}
  if (fileType === "problem") {
    updateFields.problem_statement_url = fileUrl
    updateFields.problem_statement_filename = file.name
  } else {
    updateFields.resource_file_url = fileUrl
    updateFields.resource_file_filename = file.name
  }

  const { error: updateError } = await supabase
    .from("events")
    .update(updateFields)
    .eq("id", event.id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidateTag("event-detail")
  revalidatePath("/dashboard")
  revalidatePath("/resources")

  return { success: true, fileUrl, filename: file.name }
}

export async function deleteEventFile(fileType: "problem" | "resource") {
  try {
    await verifyAdminAccess()
  } catch (e: any) {
    return { error: e.message }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  const supabase = await createClient()
  
  const { data: event, error: fetchError } = await supabase
    .from("events")
    .select("id")
    .eq("status", "active")
    .single()

  if (fetchError || !event) {
    return { error: "No active event found." }
  }

  const updateFields: any = {}
  if (fileType === "problem") {
    updateFields.problem_statement_url = null
    updateFields.problem_statement_filename = null
  } else {
    updateFields.resource_file_url = null
    updateFields.resource_file_filename = null
  }

  const { error: updateError } = await supabase
    .from("events")
    .update(updateFields)
    .eq("id", event.id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidateTag("event-detail")
  revalidatePath("/dashboard")
  revalidatePath("/resources")

  return { success: true }
}



