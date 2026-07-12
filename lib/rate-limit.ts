import { createPublicClient } from "@/lib/supabase/public"
import { headers } from "next/headers"

/**
 * Shared Rate Limiting Utility
 * 
 * Strategy:
 * - We use the Supabase `public.rate_limits` table as a stateless backend store.
 * - This provides serverless-safe rate limiting across all Next.js serverless/edge instances on Vercel.
 * - Under active load, it counts hits in a sliding window per key (IP or User ID).
 */

export async function getClientIp(): Promise<string> {
  const headerList = await headers()
  const xForwardedFor = headerList.get("x-forwarded-for")
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim()
  }
  return headerList.get("x-real-ip") || "127.0.0.1"
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = createPublicClient()
  const now = new Date()

  // 1. Fetch current rate limit entry
  const { data: record, error: fetchError } = await supabase
    .from("rate_limits")
    .select("*")
    .eq("key", key)
    .single()

  // PGRST116 indicates row was not found, which is a normal state (first request)
  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Rate Limiter Database Error:", fetchError.message)
    // Fallback: allow the request if the limiter database is down (fail-open)
    return { allowed: true, remaining: limit }
  }

  // 2. Initialize first request window if record does not exist
  if (!record) {
    const windowReset = new Date(now.getTime() + windowSeconds * 1000)
    const { error: insertError } = await supabase
      .from("rate_limits")
      .insert({
        key,
        request_count: 1,
        window_reset: windowReset.toISOString()
      })

    if (insertError) {
      console.error("Rate Limiter Insert Error:", insertError.message)
      return { allowed: true, remaining: limit - 1 }
    }

    return { allowed: true, remaining: limit - 1 }
  }

  const windowReset = new Date(record.window_reset)

  // 3. Reset window if it has expired
  if (now > windowReset) {
    const newWindowReset = new Date(now.getTime() + windowSeconds * 1000)
    const { error: updateError } = await supabase
      .from("rate_limits")
      .update({
        request_count: 1,
        window_reset: newWindowReset.toISOString()
      })
      .eq("key", key)

    if (updateError) {
      console.error("Rate Limiter Reset Error:", updateError.message)
      return { allowed: true, remaining: limit - 1 }
    }

    return { allowed: true, remaining: limit - 1 }
  }

  // 4. Deny request if limit exceeded
  if (record.request_count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  // 5. Increment count for active window
  const newCount = record.request_count + 1
  const { error: updateError } = await supabase
    .from("rate_limits")
    .update({ request_count: newCount })
    .eq("key", key)

  if (updateError) {
    console.error("Rate Limiter Increment Error:", updateError.message)
    return { allowed: true, remaining: limit - newCount }
  }

  return { allowed: true, remaining: limit - newCount }
}
