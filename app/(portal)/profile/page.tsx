"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { User, Mail, Calendar, Shield, Save, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { getUserProfile, updateProfile } from "@/actions/dashboard"
import { updateUserPassword } from "@/actions/auth"

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<any>(null)
  const [loadingProfile, setLoadingProfile] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  
  // Security Form State
  const [secLoading, setSecLoading] = React.useState(false)
  const [secMsg, setSecMsg] = React.useState({ type: "", text: "" })

  React.useEffect(() => {
    getUserProfile().then((res) => {
      if (!res.error) {
        setProfile(res)
      }
      setLoadingProfile(false)
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const fullName = formData.get("fullName") as string
    
    const res = await updateProfile(fullName)
    setLoading(false)
    if (res && !res.error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-8 pb-12">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Profile Settings</h1>
        <p className="text-text-secondary font-body">Manage your account details and security.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-surface border border-surface-border rounded-xl p-8 text-center relative overflow-hidden min-h-[300px]">
            {loadingProfile ? (
              <div className="w-full h-full flex items-center justify-center pt-24">
                <Loader2 className="animate-spin text-accent-violet" size={32} />
              </div>
            ) : (
              <>
                <div className="w-24 h-24 rounded-full bg-surface-hover border-2 border-accent-violet mx-auto flex items-center justify-center mb-6 relative z-10">
                  <span className="text-3xl font-heading font-bold text-white">
                    {profile?.fullName?.substring(0,2).toUpperCase() || profile?.email?.substring(0,2).toUpperCase()}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-1 relative z-10">{profile?.fullName || "Participant"}</h2>
                <p className="text-text-secondary text-sm mb-6 relative z-10">{profile?.email}</p>

                <div className="bg-background border border-surface-border rounded-lg p-4 text-left space-y-3 relative z-10">
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Calendar size={16} className="text-text-muted" />
                    Joined {profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : "Recently"}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary capitalize">
                    <Shield size={16} className={profile?.role === 'admin' ? "text-red-500" : "text-accent-gold"} />
                    {profile?.role} Role
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Right Column: Settings Forms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* General Info */}
          <div className="bg-surface border border-surface-border rounded-xl p-8">
            <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4">Personal Information</h2>
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-mono text-text-muted uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input name="fullName" type="text" defaultValue={profile?.fullName} disabled={loadingProfile} className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-mono text-text-muted uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input type="email" value={profile?.email || ""} readOnly disabled className="w-full bg-background/50 border border-surface-border rounded-lg pl-10 pr-4 py-3 text-text-muted cursor-not-allowed" />
                  </div>
                  <p className="text-xs text-text-muted">Contact support to change email.</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={loading} className="gap-2">
                  {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                  {!loading && !saved && <Save size={18} />}
                </Button>
              </div>
            </form>
          </div>

          {/* Security */}
          <div className="bg-surface border border-surface-border rounded-xl p-8">
            <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4">Security</h2>
            <form action={async (formData) => {
              setSecLoading(true)
              setSecMsg({ type: "", text: "" })
              const res = await updateUserPassword(formData)
              setSecLoading(false)
              if (res?.error) {
                setSecMsg({ type: "error", text: res.error })
              } else {
                setSecMsg({ type: "success", text: "Password updated successfully!" })
                // Reset form programmatically if needed, or rely on uncontrolled inputs
              }
            }} className="space-y-6">
              <div className="space-y-4 max-w-md">
                
                <div className="space-y-2">
                  <label className="text-sm font-mono text-text-muted uppercase tracking-wider">New Password</label>
                  <input name="newPassword" type="password" required placeholder="••••••••" className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors" />
                  <p className="text-xs text-text-muted">Must be at least 6 characters.</p>
                </div>

                {secMsg.text && (
                  <div className={`flex items-center gap-2 text-sm p-3 rounded border ${secMsg.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                    {secMsg.type === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                    {secMsg.text}
                  </div>
                )}

                <Button type="submit" variant="secondary" className="mt-2" disabled={secLoading}>
                  {secLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>

        </motion.div>

      </div>
    </div>
  )
}
