"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidateTag, revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { z } from "zod"

async function verifyAdminAccess() {
  const cookieStore = await cookies()
  if (cookieStore.get("admin_auth")?.value !== "true") {
    throw new Error("Unauthorized admin access")
  }
}

const CreateTrackSchema = z.object({
  name: z.string().min(1, "Track name is required"),
  description: z.string().optional(),
})

/**
 * Get all available tracks
 */
export async function getTracks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("tracks")
    .select("id, name, description")
    .order("name", { ascending: true })
  
  if (error) {
    console.error("Error fetching tracks:", error.message)
    return []
  }
  return data || []
}

/**
 * Get all problem statements for a track
 */
export async function getProblemStatements(trackId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("problem_statements")
    .select("*")
    .eq("track_id", trackId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching problem statements:", error.message)
    return []
  }
  return data || []
}

/**
 * Upload problem statement file and save to database
 */
export async function uploadProblemStatement(formData: FormData) {
  try {
    await verifyAdminAccess()
  } catch (e: any) {
    return { error: e.message }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  const supabase = await createClient()

  const trackId = formData.get("trackId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const file = formData.get("file") as File

  if (!trackId || !title || !file) {
    return { error: "Missing required fields." }
  }

  // 1. Validate file size (max 25MB)
  const maxBytes = 25 * 1024 * 1024
  if (file.size > maxBytes) {
    return { error: "File exceeds 25MB limit." }
  }

  // 2. Validate file type (pdf/docx/zip)
  const ext = file.name.split('.').pop()?.toLowerCase() || ""
  if (!["pdf", "docx", "zip"].includes(ext)) {
    return { error: "Invalid file type. Only PDF, DOCX, and ZIP are allowed." }
  }

  // 3. Upload to storage
  const arrayBuffer = await file.arrayBuffer()
  const fileBuffer = Buffer.from(arrayBuffer)
  const storagePath = `${trackId}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`

  const { error: uploadError } = await supabase.storage
    .from("problem-statements")
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: true
    })

  if (uploadError) {
    console.error("Storage upload error:", uploadError.message)
    return { error: `File upload failed: ${uploadError.message}` }
  }

  // 4. Get active admin profile
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized." }
  }

  // 5. Insert row into database
  const { data, error: dbError } = await supabase
    .from("problem_statements")
    .insert({
      track_id: trackId,
      title,
      description: description || null,
      file_url: storagePath,
      file_name: file.name,
      file_size: file.size,
      status: "draft",
      uploaded_by: user.id
    })
    .select()
    .single()

  if (dbError) {
    console.error("Database insert error:", dbError.message)
    // Clean up uploaded storage file on DB error
    await supabase.storage.from("problem-statements").remove([storagePath])
    return { error: `Database save failed: ${dbError.message}` }
  }

  revalidateTag(`problem-statements-${trackId}`)
  revalidatePath("/admin/problem-statements")
  
  return { success: true, data }
}

/**
 * Publish problem statement (flip status to published and trigger revalidations)
 */
export async function publishProblemStatement(id: string) {
  try {
    await verifyAdminAccess()
  } catch (e: any) {
    return { error: e.message }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  const supabase = await createClient()

  const { data: ps, error: fetchError } = await supabase
    .from("problem_statements")
    .select("track_id")
    .eq("id", id)
    .single()

  if (fetchError || !ps) {
    return { error: "Problem statement not found." }
  }

  const { error: updateError } = await supabase
    .from("problem_statements")
    .update({
      status: "published",
      published_at: new Date().toISOString()
    })
    .eq("id", id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidateTag(`problem-statements-${ps.track_id}`)
  revalidatePath("/admin/problem-statements")
  revalidatePath("/dashboard/problem-statements")

  return { success: true }
}

/**
 * Unpublish problem statement (flip status to draft and trigger revalidations)
 */
export async function unpublishProblemStatement(id: string) {
  try {
    await verifyAdminAccess()
  } catch (e: any) {
    return { error: e.message }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  const supabase = await createClient()

  const { data: ps, error: fetchError } = await supabase
    .from("problem_statements")
    .select("track_id")
    .eq("id", id)
    .single()

  if (fetchError || !ps) {
    return { error: "Problem statement not found." }
  }

  const { error: updateError } = await supabase
    .from("problem_statements")
    .update({
      status: "draft",
      published_at: null
    })
    .eq("id", id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidateTag(`problem-statements-${ps.track_id}`)
  revalidatePath("/admin/problem-statements")
  revalidatePath("/dashboard/problem-statements")

  return { success: true }
}

/**
 * Delete problem statement (remove database row and storage file)
 */
export async function deleteProblemStatement(id: string) {
  try {
    await verifyAdminAccess()
  } catch (e: any) {
    return { error: e.message }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  const supabase = await createClient()

  const { data: ps, error: fetchError } = await supabase
    .from("problem_statements")
    .select("track_id, file_url")
    .eq("id", id)
    .single()

  if (fetchError || !ps) {
    return { error: "Problem statement not found." }
  }

  // 1. Delete file from storage
  const { error: storageError } = await supabase.storage
    .from("problem-statements")
    .remove([ps.file_url])

  if (storageError) {
    console.warn("Delete Storage Warning:", storageError.message)
  }

  // 2. Delete database row
  const { error: dbError } = await supabase
    .from("problem_statements")
    .delete()
    .eq("id", id)

  if (dbError) {
    return { error: dbError.message }
  }

  revalidateTag(`problem-statements-${ps.track_id}`)
  revalidatePath("/admin/problem-statements")
  revalidatePath("/dashboard/problem-statements")

  return { success: true }
}

/**
 * Create a new track linked to the active event
 */
export async function createTrack(formData: { name: string; description?: string }) {
  try {
    await verifyAdminAccess()
  } catch (e: any) {
    return { error: e.message }
  }

  const ip = await getClientIp()
  const limitCheck = await checkRateLimit(`rate_limit:ip:${ip}:admin_mutations`, 20, 600)
  if (!limitCheck.allowed) return { error: "Rate limit exceeded" }

  const parsed = CreateTrackSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, description } = parsed.data

  const supabase = await createClient()

  // 1. Get active event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id")
    .eq("status", "active")
    .single()

  if (eventError || !event) {
    return { error: "No active event found. Please ensure an event is set to active first." }
  }

  // 2. Insert track
  const { data, error } = await supabase
    .from("tracks")
    .insert({
      name: name,
      description: description || null,
      event_id: event.id
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/problem-statements")
  return { success: true, data }
}
