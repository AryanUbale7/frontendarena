"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get user details
  const { data: userData } = await supabase
    .from("users")
    .select("full_name, team_name")
    .eq("id", user.id)
    .single()

  // Get submission status
  const eventId = "00000000-0000-0000-0000-000000000000" // Hardcoded active event
  const { data: submissionData } = await supabase
    .from("submissions")
    .select("status")
    .eq("participant_id", user.id)
    .eq("event_id", eventId)
    .single()

  // Get active event details
  const { data: eventData } = await supabase
    .from("events")
    .select("id, name, problem_statement, starter_kit_link, figma_link, end_date, problem_statement_url, problem_statement_filename, resource_file_url, resource_file_filename")
    .eq("status", "active")
    .single()

  return {
    fullName: userData?.full_name || user.email,
    teamName: userData?.team_name || null,
    submissionStatus: submissionData?.status || "Not Started",
    event: eventData || {
      name: "Frontend Wars 2026",
      problem_statement: null,
      starter_kit_link: null,
      figma_link: null,
      end_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
}

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  return {
    email: user.email,
    fullName: userData?.full_name || "",
    role: userData?.role || "participant",
    joinedAt: user.created_at
  }
}

export async function updateProfile(fullName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("users")
    .update({ full_name: fullName })
    .eq("id", user.id)

  if (error) return { error: error.message }
  return { success: true }
}
