"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Trophy, Inbox, LogOut, Briefcase, Menu, X, FileText } from "lucide-react"
import { adminLogout } from "@/actions/auth"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/admin/participants", label: "Participants", icon: Users },
  { href: "/admin/sponsors", label: "Sponsor Leads", icon: Briefcase },
  { href: "/admin/problem-statements", label: "Problem Statements", icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  // Close sidebar when route changes
  React.useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const handleLogout = () => {
    setIsLoggingOut(true)
  }

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden relative">
      
      {/* Dynamic Fullscreen Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-[#060608]/90 backdrop-blur-md flex flex-col items-center justify-center z-[9999] space-y-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-surface-border/60" />
            <div className="absolute inset-0 rounded-full border-2 border-t-accent-violet border-r-accent-violet animate-spin" />
          </div>
          <p className="font-mono text-xs text-text-muted uppercase tracking-[0.2em] animate-pulse">
            Terminating Admin Console Session...
          </p>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop: fixed, Mobile: drawer) */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-surface border-r border-surface-border flex flex-col z-50 transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-20 flex items-center justify-between px-8 border-b border-surface-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-heading font-bold uppercase tracking-tight text-text-primary">
              Admin <span className="text-accent-violet">Command</span>
            </span>
          </Link>
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-muted hover:text-text-primary p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive 
                    ? "bg-accent-violet/10 text-accent-violet border border-accent-violet/20" 
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-surface-border flex-shrink-0">
          <form action={adminLogout} onSubmit={handleLogout}>
            <button 
              type="submit"
              disabled={isLoggingOut}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
            >
              <LogOut size={20} />
              Admin Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Top Bar */}
        <header className="h-16 border-b border-surface-border bg-surface flex items-center justify-between px-6 lg:hidden flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-heading font-bold uppercase tracking-tight text-text-primary">
              Admin <span className="text-accent-violet">Command</span>
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-text-secondary hover:text-text-primary p-3 min-w-[44px] min-h-[44px] flex items-center justify-center border border-surface-border rounded-lg bg-surface-hover"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Main page content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="h-full p-4 sm:p-8 md:p-12 lg:p-16">
            {children}
          </div>
        </main>
      </div>

    </div>
  )
}
