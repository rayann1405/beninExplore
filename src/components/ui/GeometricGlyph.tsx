import { categoryConfig } from '@/lib/categories';

export default function GeometricGlyph({ category, className = "" }: { category: string, className?: string }) {
  const color = categoryConfig[category as keyof typeof categoryConfig]?.color || '#F2EDE1';

  return (
    <div className={`flex items-center justify-center opacity-80 ${className}`}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="2" strokeDasharray="4 4" />
        <rect x="20" y="20" width="24" height="24" transform="rotate(45 32 32)" fill={color} fillOpacity="0.2" stroke={color} />
        <circle cx="32" cy="32" r="6" fill={color} />
      </svg>
    </div>
  );
}
