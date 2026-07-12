import { ImageResponse } from 'next/og'
import { getWinnerProfile } from "@/lib/supabase/queries"

export const alt = 'Frontend Arena Winner'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const winner = await getWinnerProfile(username)
  
  const name = winner?.team_name || winner?.full_name || "Arena Contender"
  const project = winner?.submissions?.[0]?.project_name || "Champion Entry"
  const tagline = winner?.submissions?.[0]?.tagline || "Survived the Arena."

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at center, #2e120a 0%, #0a0a0a 100%)',
          color: '#ffffff',
          padding: '40px',
          border: '10px solid #cd7f32',
          position: 'relative',
        }}
      >
        {/* Border corner accents */}
        <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '4px solid #cd7f32', borderLeft: '4px solid #cd7f32', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTop: '4px solid #cd7f32', borderRight: '4px solid #cd7f32', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottom: '4px solid #cd7f32', borderLeft: '4px solid #cd7f32', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '4px solid #cd7f32', borderRight: '4px solid #cd7f32', display: 'flex' }} />

        {/* Badge */}
        <div
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#cd7f32',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          Frontend Arena Champion
        </div>

        {/* Winner Name */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#ffffff',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          {name}
        </div>

        {/* Divider */}
        <div
          style={{
            width: '120px',
            height: '2px',
            backgroundColor: '#cd7f32',
            marginBottom: '30px',
            display: 'flex',
          }}
        />

        {/* Project Name */}
        <div
          style={{
            fontSize: '32px',
            color: '#f4ebd0',
            fontWeight: 'bold',
            marginBottom: '10px',
            display: 'flex',
          }}
        >
          {project}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '20px',
            color: '#a09b8c',
            fontStyle: 'italic',
            textAlign: 'center',
            maxWidth: '800px',
            display: 'flex',
          }}
        >
          "{tagline}"
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
