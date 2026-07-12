"use server"

import { createClient } from "@/lib/supabase/server"
import { createPublicClient } from "@/lib/supabase/public"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { z } from "zod"

const SponsorInquirySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  tier: z.string().min(1, "Tier is required"),
  message: z.string().optional(),
})

// Dynamic Real-time Leaderboard query (un-cached)
export async function getLeaderboardData() {
  return { data: [] }
}

export async function getTournamentsData() {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: false })
    .limit(10)

  if (error) return { error: error.message }
  return { data }
}

export async function submitSponsorInquiry(formData: {
  firstName: string
  lastName: string
  email: string
  company: string
  tier: string
  message?: string
}) {
  const ip = await getClientIp()
  const rateLimitKey = `rate_limit:ip:${ip}:sponsor_inquiry`
  const limitCheck = await checkRateLimit(rateLimitKey, 5, 600)
  
  if (!limitCheck.allowed) {
    return { error: "Too many requests. Please try again in 10 minutes." }
  }

  const parsed = SponsorInquirySchema.safeParse(formData)
  
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { firstName, lastName, email, company, tier, message } = parsed.data

  const supabase = await createClient() // Uses Server Component/cookie client for mutations
  const { data, error } = await supabase
    .from("sponsor_inquiries")
    .insert([
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        company: company,
        tier: tier,
        message: message,
      }
    ])
    .select()

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}
