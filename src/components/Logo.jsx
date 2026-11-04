export function Logo({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M16 2 6 6.5V15c0 6.4 4.2 11.2 10 13 5.8-1.8 10-6.6 10-13V6.5L16 2zm0 6.2 6.2 2.3V15c0 4.2-2.6 7.5-6.2 8.8C12.4 22.5 9.8 19.2 9.8 15V10.5L16 8.2z"
      />
    </svg>
  )
}
