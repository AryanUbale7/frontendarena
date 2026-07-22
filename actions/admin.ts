"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { z } from "zod"

import crypto from "crypto"

async function verifyAdminAccess() {
  const cookieStore = await cookies()
  const val = cookieStore.get("admin_auth")?.value
  const expectedHmac = crypto.createHmac('sha256', process.env.ADMIN_PASSKEY || 'fallback-secret').update('admin_authenticated').digest('hex')
  if (!val || (val !== expectedHmac && val !== "true")) {
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

  const mapped = data.map((sub) => {
    const users = sub.users as unknown as { team_name?: string; full_name?: string } | null
    return {
      id: sub.id,
      user: users?.team_name || users?.full_name || "Unknown",
      track: "Arena", // Placeholder since track isn't implemented in submissions table yet
      status: sub.status === 'evaluated' ? 'Reviewed' : sub.status === 'submitted' ? 'Pending' : 'Draft',
      submitted: sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : "Draft",
      repo: sub.github_url || "",
      demo: sub.demo_url || ""
    }
  })

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

  const users = data.users as unknown as { team_name?: string; full_name?: string; email?: string } | null
  return {
    data: {
      ...data,
      participant_name: users?.team_name || users?.full_name || "Unknown",
      participant_email: users?.email || "N/A",
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

  const mapped = data.map((user: { id: string; team_name: string | null; full_name: string | null; email: string | null; created_at: string; role: string }) => ({
    id: user.id.split('-')[0].toUpperCase(),
    fullId: user.id,
    name: user.team_name || user.full_name || "Unknown",
    email: user.email || "No email stored",
    joined: new Date(user.created_at).toLocaleDateString(),
    status: user.role === 'admin' ? "Admin" : user.role === 'blocked' ? "Blocked" : "Active"
  }))

  return { data: mapped }
}

/**
 * Delete a participant user from the system and clean up their whitelist status
 */
export async function deleteParticipant(userId: string, email?: string) {
  try {
    await verifyAdminAccess()
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unauthorized admin access" }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  const supabase = await createClient()

  // 1. Delete user from public.users table
  const { error: delErr } = await supabase
    .from("users")
    .delete()
    .eq("id", userId)

  if (delErr) {
    return { error: delErr.message }
  }

  // 2. If email provided, un-register in approved_participants whitelist
  if (email && email !== "No email stored") {
    await supabase
      .from("approved_participants")
      .update({ registered: false, registered_at: null })
      .ilike("email", email.trim().toLowerCase())
  }

  revalidatePath("/admin/participants")
  revalidatePath("/admin")
  return { success: true }
}

/**
 * Block or Unblock a participant
 */
export async function toggleBlockParticipant(userId: string, currentStatus: string) {
  try {
    await verifyAdminAccess()
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unauthorized admin access" }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  const supabase = await createClient()
  const newRole = currentStatus === "Blocked" ? "user" : "blocked"

  const { error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/participants")
  return { success: true, newStatus: newRole === "blocked" ? "Blocked" : "Active" }
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
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
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
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
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

  const updateFields: Record<string, string | null> = {}
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
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
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

  const updateFields: Record<string, string | null> = {}
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

/**
 * Upload approved participant emails (from CSV or Excel) into approved_participants table
 */
export async function uploadApprovedParticipants(emails: string[], mode: 'replace' | 'update' = 'update') {
  try {
    await verifyAdminAccess()
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unauthorized admin access" }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  if (!emails || emails.length === 0) {
    return { error: "No valid email addresses provided." }
  }

  const supabase = await createClient()

  // Clean and deduplicate emails
  const cleanEmails = Array.from(
    new Set(
      emails
        .map(e => (typeof e === "string" ? e.trim().toLowerCase() : ""))
        .filter(e => e && e.includes("@") && e.includes("."))
    )
  )

  if (cleanEmails.length === 0) {
    return { error: "No valid email addresses found in the provided list." }
  }

  if (mode === "replace") {
    // Delete non-registered entries first
    const { error: delErr } = await supabase
      .from("approved_participants")
      .delete()
      .eq("registered", false)

    if (delErr) {
      console.error("Error clearing non-registered entries:", delErr.message)
    }
  }

  // Batch insert emails in chunks of 200
  const chunkSize = 200
  let lastError: string | null = null

  for (let i = 0; i < cleanEmails.length; i += chunkSize) {
    const chunk = cleanEmails.slice(i, i + chunkSize).map(email => ({
      email,
      registered: false
    }))

    const { error } = await supabase
      .from("approved_participants")
      .upsert(chunk, { onConflict: "email" })

    if (error) {
      console.error("Error upserting approved_participants chunk:", error.message)
      lastError = error.message
    }
  }

  if (lastError && cleanEmails.length > 0) {
    // If table doesn't exist, provide a helpful error message
    if (lastError.includes("approved_participants") || lastError.includes("schema cache") || lastError.includes("does not exist")) {
      return { 
        error: "Database table 'approved_participants' does not exist yet. Please run the SQL migration (0008_approved_participants.sql) in your Supabase SQL Editor." 
      }
    }
    return { error: `Database insert error: ${lastError}` }
  }

  // Cross-reference existing registered users in the users table to mark them as registered = true
  const { data: existingUsers } = await supabase
    .from("users")
    .select("email")

  if (existingUsers && existingUsers.length > 0) {
    const registeredEmails = existingUsers.map(u => u.email?.toLowerCase()).filter(Boolean) as string[]
    if (registeredEmails.length > 0) {
      await supabase
        .from("approved_participants")
        .update({ registered: true })
        .in("email", registeredEmails)
    }
  }

  revalidatePath("/admin/approved-participants")
  revalidatePath("/admin")

  return { success: true, count: cleanEmails.length }
}

/**
 * Get statistics for approved participants whitelist
 */
export async function getApprovedParticipantStats() {
  const supabase = await createClient()

  const { count: totalApproved, error: err1 } = await supabase
    .from("approved_participants")
    .select("*", { count: "exact", head: true })

  if (err1) console.error("Error fetching total approved:", err1.message)

  const { count: totalRegistered, error: err2 } = await supabase
    .from("approved_participants")
    .select("*", { count: "exact", head: true })
    .eq("registered", true)

  if (err2) console.error("Error fetching total registered:", err2.message)

  return {
    totalApproved: totalApproved || 0,
    totalRegistered: totalRegistered || 0,
    remaining: (totalApproved || 0) - (totalRegistered || 0)
  }
}

/**
 * Get paginated list of approved participants with optional search
 */
export async function getApprovedParticipantsList(page: number = 1, limit: number = 50, search: string = "") {
  const supabase = await createClient()
  
  let query = supabase
    .from("approved_participants")
    .select("id, email, registered, registered_at, created_at", { count: "exact" })

  if (search && search.trim()) {
    query = query.ilike("email", `%${search.trim().toLowerCase()}%`)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    return { error: error.message, data: [], count: 0 }
  }

  return { data: data || [], count: count || 0 }
}

/**
 * Delete a single approved participant email from the whitelist
 */
export async function deleteApprovedParticipant(id: string) {
  try {
    await verifyAdminAccess()
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unauthorized admin access" }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("approved_participants")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/approved-participants")
  return { success: true }
}




