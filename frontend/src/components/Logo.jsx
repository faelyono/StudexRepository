export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5"/>
          <stop offset="45%" stopColor="#2563EB"/>
          <stop offset="100%" stopColor="#06CCF0"/>
        </linearGradient>
        <linearGradient id="lg2" x1="10" y1="30" x2="90" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#060D2E"/>
          <stop offset="100%" stopColor="#0C1A4A"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#lg1)"/>
      {/* S top arc */}
      <path d="M68 22 C84 22 88 34 82 44 C76 54 60 56 50 56 C40 56 28 60 24 68 C20 76 26 84 38 86 L30 94 C10 90 4 76 12 64 C20 52 38 50 50 50 C62 50 76 46 80 36 C84 26 76 18 64 18 Z" fill="url(#lg1)" opacity="0.9"/>
      {/* Chat bubble */}
      <ellipse cx="50" cy="56" rx="20" ry="13" fill="url(#lg2)"/>
      {/* Three dots */}
      <circle cx="41" cy="56" r="2.5" fill="white" opacity="0.95"/>
      <circle cx="50" cy="56" r="2.5" fill="white" opacity="0.95"/>
      <circle cx="59" cy="56" r="2.5" fill="white" opacity="0.95"/>
      {/* Sparkle */}
      <path d="M70 32 L72 26 L74 32 L80 34 L74 36 L72 42 L70 36 L64 34 Z" fill="white" opacity="0.95"/>
    </svg>
  );
}
