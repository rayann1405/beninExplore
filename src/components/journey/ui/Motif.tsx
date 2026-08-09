import { useId } from 'react';

// Ornements géométriques inspirés des appliqués Adanhoumè et des bas-reliefs
// d'Abomey : chaîne de losanges (« line », séparateur) ou médaillon central
// (« emblem », emblème). Couleur héritée via `currentColor` (text-gold, etc.).
export default function Motif({
  variant = 'line',
  className,
}: {
  variant?: 'line' | 'emblem';
  className?: string;
}) {
  const patId = `motif-${useId().replace(/[:]/g, '')}`;

  if (variant === 'emblem') {
    return (
      <svg viewBox="0 0 120 28" className={className} fill="none" aria-hidden="true">
        <path d="M60 2 L72 14 L60 26 L48 14 Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M60 7 L65 14 L60 21 L55 14 Z" fill="currentColor" />
        <path d="M22 14 H44 M76 14 H98" stroke="currentColor" strokeWidth="1" />
        <path d="M12 9 L17 14 L12 19 L7 14 Z" stroke="currentColor" strokeWidth="1" />
        <path d="M108 9 L113 14 L108 19 L103 14 Z" stroke="currentColor" strokeWidth="1" />
        <circle cx="17" cy="14" r="1.3" fill="currentColor" />
        <circle cx="103" cy="14" r="1.3" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 20" className={className} fill="none" aria-hidden="true">
      <defs>
        <pattern id={patId} width="32" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 2 L18 10 L10 18 L2 10 Z" stroke="currentColor" strokeWidth="0.9" />
          <circle cx="10" cy="10" r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="118" height="20" fill={`url(#${patId})`} />
      <path d="M148 2 L160 10 L148 18 L136 10 Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M172 10 H198 M122 10 H136" stroke="currentColor" strokeWidth="0.9" />
      <rect x="202" width="118" height="20" fill={`url(#${patId})`} />
    </svg>
  );
}
