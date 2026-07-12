import { MetadataRoute } from 'next'
import { createPublicClient } from '@/lib/supabase/public'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://frontendarena.com'
  const supabase = createPublicClient()

  // 1. Fetch all winner profiles (based on users table)
  const { data: users } = await supabase
    .from("users")
    .select("id")

  const winnerUrls = (users || []).map((user) => {
    return {
      url: `${baseUrl}/hall-of-fame/${user.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  // 2. Static routes
  const staticUrls = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/hall-of-fame`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/sponsors`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.8 },
    { url: `${baseUrl}/frontend-wars-2026`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ]

  return [...staticUrls, ...winnerUrls]
}
