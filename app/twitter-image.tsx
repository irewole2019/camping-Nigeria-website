import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 600,
}

export const alt = 'Camping Nigeria — Outdoor Learning Reimagined'
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '50px',
          background:
            'linear-gradient(135deg, rgba(14,62,46,1) 0%, rgba(8,30,22,1) 60%, rgba(230,179,37,0.25) 100%)',
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
            padding: '8px 20px',
            fontSize: 20,
            letterSpacing: 1.3,
            textTransform: 'uppercase',
            color: '#e6b325',
            alignSelf: 'flex-start',
          }}
        >
          Camping Nigeria
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 900 }}>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.08 }}>
            Real Growth Happens Outside
          </div>
          <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>
            Outdoor programmes that build confidence, leadership, and teamwork.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
