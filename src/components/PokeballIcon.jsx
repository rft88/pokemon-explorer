export default function PokeballIcon({ size = 24, spinning = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={spinning ? { animation: 'spin 0.8s linear infinite' } : {}}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="11" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      <path d="M1 12 Q1 1 12 1 Q23 1 23 12Z" fill="#cc2c2c" />
      <rect x="1" y="11.2" width="22" height="1.6" fill="#444" />
      <circle cx="12" cy="12" r="3.5" fill="#1a1a1a" stroke="#555" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="1.8" fill="#f0ede8" opacity="0.15" />
    </svg>
  )
}
