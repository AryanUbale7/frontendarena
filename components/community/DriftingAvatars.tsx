import * as React from "react"
import { Avatar } from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"

// Deterministic data to avoid React hydration mismatches between Server and Client.
// Each node defines an anchor position (x,y %), drift distance, and animation duration.
const avatarData = [
  { id: 1, x: 15, y: 20, size: "sm", dur: "18s", delay: "-2s", driftX: 30, driftY: -20 },
  { id: 2, x: 80, y: 15, size: "md", dur: "22s", delay: "-5s", driftX: -25, driftY: 25 },
  { id: 3, x: 10, y: 70, size: "lg", dur: "25s", delay: "-12s", driftX: 40, driftY: 30 },
  { id: 4, x: 85, y: 80, size: "sm", dur: "15s", delay: "-1s", driftX: -30, driftY: -40 },
  { id: 5, x: 25, y: 85, size: "md", dur: "20s", delay: "-7s", driftX: 20, driftY: -30 },
  { id: 6, x: 75, y: 40, size: "sm", dur: "17s", delay: "-10s", driftX: -35, driftY: 15 },
  { id: 7, x: 30, y: 35, size: "lg", dur: "28s", delay: "-18s", driftX: 45, driftY: 35 },
  { id: 8, x: 60, y: 85, size: "md", dur: "24s", delay: "-3s", driftX: -20, driftY: -25 },
  { id: 9, x: 5, y: 45, size: "sm", dur: "19s", delay: "-8s", driftX: 25, driftY: 20 },
  { id: 10, x: 90, y: 55, size: "md", dur: "21s", delay: "-15s", driftX: -40, driftY: -15 },
] as const

export function DriftingAvatars({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(var(--dx), var(--dy)); }
          66% { transform: translate(calc(var(--dx) * 0.5), calc(var(--dy) * -0.5)); }
        }
        .animate-drift {
          animation: drift var(--dur) ease-in-out infinite var(--delay);
        }
        .animate-drift:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {avatarData.map((data) => (
        <div
          key={data.id}
          className="absolute group pointer-events-auto transition-transform duration-300 hover:scale-125"
          style={{
            top: `${data.y}%`,
            left: `${data.x}%`,
            // @ts-ignore - CSS custom properties
            "--dx": `${data.driftX}px`,
            "--dy": `${data.driftY}px`,
            "--dur": data.dur,
            "--delay": data.delay,
          }}
        >
          <div className="animate-drift">
            <Avatar 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=FWAR${data.id}&backgroundColor=1e1b4b,312e81&backgroundType=gradientLinear`}
              fallback={`U${data.id}`} 
              size={data.size} 
              className="border-2 border-surface-border shadow-lg"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
