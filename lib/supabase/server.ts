import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'


/**
 * Standard Supabase client for Server Components, Actions, and Route Handlers.
 * 
 * Note: Under the hood, `@supabase/supabase-js` and `@supabase/ssr` perform queries
 * via Supabase's PostgREST API layer (HTTP requests over TLS).
 * PostgREST is automatically pooled and scales natively in serverless/Vercel environments,
 * completely avoiding the "too many connections" issues associated with direct database connections.
 */
export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set')
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * CONFIGURATION FOR RAW POSTGRES ACCESS
 * 
 * If you ever need to perform raw PostgreSQL access (using pg/node-postgres, postgres-js, or prisma/drizzle),
 * you MUST use the POOLED connection string (port 6543, Transaction mode) to avoid database connection exhaustion.
 * 
 * Direct connection (port 5432) is STRICTLY FORBIDDEN for serverless/edge runtimes on Vercel.
 * 
 * Target pooled connection string format:
 * postgres://[user].[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/[db-name]?pgbouncer=true
 */
export const getPooledDatabaseConfig = () => {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    return null
  }

  // Verification audit: ensure the connection string is using the Supavisor pooler (port 6543)
  const isPooled = dbUrl.includes(":6543") || dbUrl.includes("pgbouncer=true")
  
  if (!isPooled && process.env.NODE_ENV === "production") {
    console.warn(
      "WARNING: DATABASE_URL does not seem to point to the pooled connection (port 6543). " +
      "Direct connections (port 5432) will fail under heavy concurrent loads on Vercel."
    )
  }

  return {
    connectionString: dbUrl,
    isPooled
  }
}
