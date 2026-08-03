export default function PatternDivider({ color = '#C1440E' }: { color?: string }) {
  return (
    <div className="w-full flex justify-center py-4 opacity-50">
      <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10L20 0H40L30 10L40 20H20L10 10Z" fill={color} />
        <path d="M50 10L60 0H80L70 10L80 20H60L50 10Z" fill={color} />
        <path d="M90 10L100 0H120L110 10L120 20H100L90 10Z" fill={color} />
      </svg>
    </div>
  );
}
