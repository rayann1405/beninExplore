import type { CSSProperties } from 'react';

// Motifs graphiques inspirés des tentures appliquées d'Abomey (bo hun) :
// aplats nets, silhouettes simples, couleurs saturées. Interprétation
// décorative et narrative — pas une reproduction de symboles cultuels.
//
// - 'sun'    : petit soleil (pictogramme, puces, icône de marque)
// - 'emblem' : soleil rayonnant (médaillon, épilogue)
// - 'divider': bande de séparateur — fanions triangulaires sur bandes de couleur
// - 'rule'   : filet d'archive — doubles hairlines or encadrant un losange
const COLORS = [
  'var(--color-laterite)',
  'var(--color-gold)',
  'var(--color-palm)',
  'var(--color-indigo)',
];

export default function Motif({
  variant = 'divider',
  className,
  style,
}: {
  variant?: 'sun' | 'emblem' | 'divider' | 'rule';
  className?: string;
  style?: CSSProperties;
}) {

  if (variant === 'sun') {
    return (
      <svg viewBox="0 0 16 16" className={className} style={style} fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={8 + Math.cos(a) * 4.4}
                y1={8 + Math.sin(a) * 4.4}
                x2={8 + Math.cos(a) * 6}
                y2={8 + Math.sin(a) * 6}
              />
            );
          })}
        </g>
        <circle cx="8" cy="8" r="2.6" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'emblem') {
    return (
      <svg viewBox="0 0 96 96" className={className} style={style} fill="none" aria-hidden="true">
        <g fill="var(--color-gold)">
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d="M48 6 L52 16 L44 16 Z"
              transform={`rotate(${i * 22.5} 48 48)`}
            />
          ))}
        </g>
        <circle cx="48" cy="48" r="22" fill="var(--color-gold)" />
        <circle cx="48" cy="48" r="13" fill="var(--color-indigo)" />
        <circle cx="48" cy="48" r="5.5" fill="var(--color-laterite)" />
      </svg>
    );
  }

  if (variant === 'rule') {
    return (
      <svg viewBox="0 0 288 12" className={className} style={style} fill="none" aria-hidden="true">
        <line x1="0" y1="3" x2="140" y2="3" stroke="var(--color-gold)" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="0" y1="9" x2="140" y2="9" stroke="var(--color-gold)" strokeOpacity="0.18" strokeWidth="1" />
        <line x1="148" y1="3" x2="288" y2="3" stroke="var(--color-gold)" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="148" y1="9" x2="288" y2="9" stroke="var(--color-gold)" strokeOpacity="0.18" strokeWidth="1" />
        <path d="M144 1.5 L149 6 L144 10.5 L139 6 Z" fill="var(--color-gold)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 22" className={className} style={style} fill="none" aria-hidden="true">
      <rect y="0.5" width="320" height="1.4" fill="var(--color-gold)" />
      <rect y="20.1" width="320" height="1.4" fill="var(--color-indigo)" />

      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d="M4 3 L12 11 L4 19 Z"
          transform={`translate(${i * 36} 0) ${i % 2 === 0 ? 'rotate(0 8 11)' : 'rotate(180 8 11)'}`}
          fill={COLORS[i % 4]}
        />
      ))}
    </svg>
  );
}
