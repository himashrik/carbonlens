interface ScoreRingProps {
  score: number; // 0–100
  size?: number;
  label?: string;
  sublabel?: string;
}

/**
 * The "Eco Ring" — CarbonLens's signature visual element. A tree-ring-inspired
 * gauge: concentric arcs that fill proportionally to the sustainability score,
 * echoing growth rings in a tree trunk. Used in the hero, dashboard, and
 * calculator results so the score always has the same recognizable home.
 */
export default function ScoreRing({ score, size = 180, label, sublabel }: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const strokeWidth = size * 0.09;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  const color = clamped >= 80 ? '#6FBF8B' : clamped >= 60 ? '#5FD0C0' : clamped >= 40 ? '#E3A857' : '#E0735C';

  return (
    <div className="relative inline-flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* track ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0E2F23"
          strokeOpacity={0.08}
          strokeWidth={strokeWidth}
        />
        {/* inner ring — faint tree-ring echo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth - 4}
          fill="none"
          stroke="#0E2F23"
          strokeOpacity={0.05}
          strokeWidth={strokeWidth * 0.5}
        />
        {/* progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.5s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-4xl font-semibold text-canopy">{Math.round(clamped)}</span>
        <span className="label-eyebrow">{label ?? 'Eco Score'}</span>
        {sublabel && <span className="text-xs text-ink/50 mt-1">{sublabel}</span>}
      </div>
    </div>
  );
}
