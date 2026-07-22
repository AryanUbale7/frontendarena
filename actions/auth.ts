"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { z } from "zod"
import crypto from "crypto"

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
  teamName: z.string().optional(),
})

const ResetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

const UpdatePasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
})

export async function login(formData: FormData) {
  const ip = await getClientIp()
  const rateLimitKey = `rate_limit:ip:${ip}:login`
  const limitCheck = await checkRateLimit(rateLimitKey, 5, 600)
  
  if (!limitCheck.allowed) {
    return { error: "Too many login attempts. Please try again in 10 minutes." }
  }

  const supabase = await createClient()
  
  // Note: The UI calls this "Team Name", but we'll use it as the email for auth purposes 
  // or we need to extract an email. Assuming the input name is 'email'
  const emailRaw = formData.get("email") as string
  const passwordRaw = formData.get("password") as string

  const parsed = LoginSchema.safeParse({ email: emailRaw, password: passwordRaw })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const { email, password } = parsed.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const ip = await getClientIp()
  const rateLimitKey = `rate_limit:ip:${ip}:signup`
  const limitCheck = await checkRateLimit(rateLimitKey, 5, 600)
  
  if (!limitCheck.allowed) {
    return { error: "Too many signup attempts. Please try again in 10 minutes." }
  }

  const supabase = await createClient()
  
  const parsed = SignupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    teamName: formData.get("teamName"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const { email, password, fullName, teamName } = parsed.data

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        team_name: teamName,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // If you require email confirmation, redirect to a check-email page
  // For hackathons, if auto-confirm is on:
  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const parsed = ResetPasswordSchema.safeParse({
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const { email } = parsed.data

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updateUserPassword(formData: FormData) {
  const supabase = await createClient()
  const parsed = UpdatePasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const { newPassword } = parsed.data

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const adminUsername = process.env.ADMIN_USERNAME
  const adminPasskey = process.env.ADMIN_PASSKEY

  if (adminUsername && adminPasskey && email === adminUsername && password === adminPasskey) {
    const cookieStore = await cookies()
    const hmac = crypto.createHmac('sha256', process.env.ADMIN_PASSKEY || 'fallback-secret').update('admin_authenticated').digest('hex')
    cookieStore.set("admin_auth", hmac, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })
    
    redirect("/admin")
  }

  return { error: "Invalid admin credentials" }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_auth")
  redirect("/")
}
