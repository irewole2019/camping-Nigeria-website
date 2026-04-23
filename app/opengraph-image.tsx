import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const alt = 'Camping Nigeria — Outdoor Learning Reimagined'
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          background:
            'linear-gradient(135deg, rgba(14,62,46,1) 0%, rgba(8,30,22,1) 55%, rgba(230,179,37,0.2) 100%)',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid rgba(230, 179, 37, 0.5)',
            borderRadius: 999,
            padding: '10px 22px',
            fontSize: 24,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: '#e6b325',
            alignSelf: 'flex-start',
          }}
        >
          Camping Nigeria
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 980 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.04 }}>
            Outdoor Learning, Reimagined for Nigerian Schools
          </div>
          <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>
            Structured, safe, and development-focused programmes for schools, organizations, and
            individuals.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
