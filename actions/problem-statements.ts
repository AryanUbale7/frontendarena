"use server"

import { createClient } from "@/lib/supabase/server"
import { createPublicClient } from "@/lib/supabase/public"

/**
 * Fetch published problem statements for a track
 */
export async function getPublishedProblemStatements(trackId: string) {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("problem_statements")
    .select("id, title, description, file_url, file_name, file_size, published_at")
    .eq("track_id", trackId)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching problem statements:", error.message)
    return []
  }

  return data || []
}

/**
 * Generate a signed URL to download a problem statement file securely
 */
export async function generateSignedDownloadUrl(fileUrl: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .storage
    .from("problem-statements")
    .createSignedUrl(fileUrl, 300) // 5 minutes validity

  if (error) {
    console.error("Error generating signed download URL:", error.message)
    return { error: error.message }
  }

  return { signedUrl: data.signedUrl }
}

/**
 * Register the logged-in participant for a track
 */
export async function registerForTrack(trackId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // 1. Get user's profile/team_name
  const { data: userData } = await supabase
    .from("users")
    .select("full_name, team_name")
    .eq("id", user.id)
    .single()

  const teamName = userData?.team_name || `${userData?.full_name || 'User'}'s Team`

  // 2. Check if a team already exists for this track with this name
  let teamId = ""
  const { data: existingTeam } = await supabase
    .from("teams")
    .select("id")
    .eq("track_id", trackId)
    .eq("name", teamName)
    .single()

  if (existingTeam) {
    teamId = existingTeam.id
  } else {
    // Create new team for this track
    const { data: newTeam, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: teamName,
        track_id: trackId
      })
      .select("id")
      .single()

    if (teamError || !newTeam) {
      return { error: teamError?.message || "Failed to create team for track." }
    }
    teamId = newTeam.id
  }

  // 3. Add user to team_members
  const { error: memberError } = await supabase
    .from("team_members")
    .insert({
      team_id: teamId,
      user_id: user.id
    })

  if (memberError && !memberError.message.includes("duplicate")) {
    return { error: memberError.message }
  }

  return { success: true }
}

/**
 * Fetch tracks that the logged-in participant is registered for
 */
export async function getParticipantTracks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("team_members")
    .select(`
      teams (
        id,
        name,
        tracks (
          id,
          name,
          description
        )
      )
    `)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching participant tracks:", error.message)
    return []
  }

  const tracks: any[] = []
  const trackIds = new Set()
  
  data?.forEach((row: any) => {
    const track = row.teams?.tracks
    if (track && !trackIds.has(track.id)) {
      trackIds.add(track.id)
      tracks.push(track)
    }
  })

  return tracks
}

/**
 * Get all available tracks
 */
export async function getTracks() {
  const supabase = createPublicClient()
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
