import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"

export const getHomepageData = unstable_cache(
  async () => {
    const supabase = createPublicClient()

    // 1. Fetch Stats (Users count, Event count)
    const { count: usersCount, error: userErr } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
    if (userErr) console.error("Error fetching users count:", userErr.message)

    const { count: eventsCount, error: eventErr } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
    if (eventErr) console.error("Error fetching events count:", eventErr.message)

    const { data: sponsorBenefits, error: sponsorErr } = await supabase
      .from("sponsor_benefits")
      .select("sponsor_name")
    if (sponsorErr) console.error("Error fetching sponsor names:", sponsorErr.message)

    const sponsorsCount = new Set(sponsorBenefits?.map(s => s.sponsor_name) || []).size

    // 3. Fetch unique sponsor logos (names)
    const uniqueSponsors = Array.from(
      new Set(sponsorBenefits?.map(s => s.sponsor_name) || ["UptoSkills", "InterviewBuddy"])
    )

    return {
      stats: {
        participants: `${1300 + (usersCount || 0)}+`,
        sponsors: (sponsorsCount || 0) > 0 ? `${sponsorsCount}` : "2+",
        events: `${eventsCount || 1}`
      },
      hallOfFame: [],
      sponsors: uniqueSponsors
    }
  },
  ["homepage-data"],
  { revalidate: 300, tags: ["homepage-data"] }
)

export const getHallOfFameData = unstable_cache(
  async () => {
    return []
  },
  ["hall-of-fame-list"],
  { revalidate: 3600, tags: ["hall-of-fame-list"] }
)

export const getSponsorsPageData = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("sponsor_benefits")
      .select("sponsor_name, benefit_type, description, discount_code")
      .limit(50)

    if (error) {
      console.error("Error in getSponsorsPageData:", error.message)
      return []
    }

    return data || []
  },
  ["sponsors-list"],
  { revalidate: 3600, tags: ["sponsors-list"] }
)

export const getEventPageData = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "active")
      .single()

    if (error) {
      console.warn("No active event found, using fallback configurations:", error.message)
      return {
        id: "00000000-0000-0000-0000-000000000000",
        name: "Frontend Wars 2026",
        description: "The flagship event of Frontend Arena.",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        tracks: []
      }
    }

    const { data: tracksData } = await supabase
      .from("tracks")
      .select("id, name, description")
      .eq("event_id", data.id)

    return {
      ...data,
      tracks: tracksData || []
    }
  },
  ["event-detail"],
  { revalidate: 60, tags: ["event-detail"] }
)

export async function getWinnerProfile(username: string) {
  const supabase = createPublicClient()
  
  let query = supabase.from("users").select(`
    id,
    full_name,
    team_name,
    avatar_url,
    created_at,
    submissions (
      project_name,
      tagline,
      description,
      github_url,
      demo_url,
      tech_stack,
      submitted_at,
      status
    )
  `)

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(username)
  
  if (isUuid) {
    query = query.eq("id", username)
  } else {
    query = query.or(`team_name.ilike.%${username}%,full_name.ilike.%${username}%`)
  }

  const { data: user, error } = await query.maybeSingle()
  if (error || !user) {
    return null
  }

  const validSubmissions = user.submissions?.filter((sub: any) => 
    sub.status === "submitted" || sub.status === "evaluated"
  ) || []

  return {
    ...user,
    submissions: validSubmissions
  }
}

export const getCachedWinnerProfile = (username: string) => {
  return unstable_cache(
    async () => getWinnerProfile(username),
    ["winner-profile", username],
    { revalidate: 3600, tags: [`winner-profile-${username}`, "hall-of-fame-list"] }
  )()
}
