"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileCode2, BookOpen, FileText, Gift, User, LogOut, Menu, X, ClipboardList } from "lucide-react"
import { logout } from "@/actions/auth"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/submissions", label: "Project Submission", icon: FileCode2 },
  { href: "/rules", label: "Rules & Guidelines", icon: BookOpen },
  { href: "/sponsor-benefits", label: "Sponsor Benefits", icon: Gift },
  { href: "/profile", label: "Profile", icon: User },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
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
            <div className="absolute inset-0 rounded-full border-2 border-t-accent-gold border-r-accent-gold animate-spin" />
          </div>
          <p className="font-mono text-xs text-text-muted uppercase tracking-[0.2em] animate-pulse">
            Invalidating Secure Session...
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

      {/* Portal Sidebar (Desktop: fixed, Mobile: drawer) */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-surface border-r border-surface-border flex flex-col z-50 transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-20 flex items-center justify-between px-8 border-b border-surface-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-heading font-bold uppercase tracking-tight text-text-primary">
              Frontend <span className="text-accent-gold">Arena</span>
            </span>
          </Link>
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-muted hover:text-text-primary p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href) && item.href !== "#"
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive 
                    ? "bg-accent-gold/10 text-accent-gold border border-accent-gold/20" 
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
          <form action={logout} onSubmit={handleLogout}>
            <button 
              type="submit"
              disabled={isLoggingOut}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
            >
              <LogOut size={20} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Mobile Top Bar */}
        <header className="h-16 border-b border-surface-border bg-surface flex items-center justify-between px-6 lg:hidden flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-heading font-bold uppercase tracking-tight text-text-primary">
              Frontend <span className="text-accent-gold">Arena</span>
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-text-secondary hover:text-text-primary p-2 border border-surface-border rounded-lg bg-surface-hover"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 blur-[100px] rounded-full pointer-events-none z-0" />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background relative z-10">
          <div className="h-full p-4 sm:p-8 md:p-12 lg:p-16 max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  )
}
