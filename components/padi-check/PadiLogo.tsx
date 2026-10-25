import { useId } from 'react'

/**
 * The Padi Check mark: a "P" with a tick cut through it (founder's design,
 * 2026-10-25), redrawn as a vector. The tick is a true cut-out (an SVG mask),
 * so the mark sits on any background. `bright` is for the dark sign-in screen;
 * `brand` is the original dark-to-light green.
 */
export default function PadiLogo({
  tone = 'brand',
  className,
}: {
  tone?: 'brand' | 'bright'
  className?: string
}) {
  const id = useId().replace(/:/g, '')
  const [dark, light] = tone === 'bright' ? ['#22c55e', '#86efac'] : ['#075a32', '#23913a']
  return (
    <svg viewBox="0 0 650 745" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="330" y1="380" x2="620" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={dark} />
          <stop offset="1" stopColor={light} />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="650" height="745">
          <rect width="650" height="745" fill="#fff" />
          <polyline
            points="-30,412 176,250 315,355 512,175"
            fill="none"
            stroke="#000"
            strokeWidth="104"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <path
        d="M10,120 A110,110 0 0 1 120,10 L385,10 A255,255 0 0 1 385,520 L255,520 L255,635 A100,100 0 0 1 55,635 L55,405 L10,360 Z"
        fill={`url(#${id}-g)`}
        mask={`url(#${id}-m)`}
      />
    </svg>
  )
}
