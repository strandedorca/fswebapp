import { bandColor } from '../lib/explainUrl.js'

export function TrustGauge({ score, tone }) {
  const color = bandColor(tone)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  return (
    <div className="relative h-36 w-36 shrink-0" role="img" aria-label={`Trust score ${score} out of 100`}>
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1c2636" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold leading-none" style={{ color }}>
          {score}
        </span>
        <span className="mt-1 text-xs text-mist">/100</span>
      </div>
    </div>
  )
}
