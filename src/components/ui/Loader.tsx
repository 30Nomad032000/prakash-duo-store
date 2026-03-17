'use client';

import { Trefoil } from 'ldrs/react';
import 'ldrs/react/Trefoil.css';

interface LoaderProps {
  size?: string;
  color?: string;
  className?: string;
  label?: string;
}

export default function Loader({ size = '40', color = '#C8882A', className = '', label }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-5 ${className}`}>
      <div className="relative">
        {/* Subtle glow behind loader */}
        <div className="absolute inset-0 bg-deep-ochre/10 rounded-full blur-xl scale-150" />
        <div className="relative">
          <Trefoil
            size={size}
            stroke="4"
            strokeLength="0.15"
            bgOpacity="0.1"
            speed="1.4"
            color={color}
          />
        </div>
      </div>
      {label && (
        <p className="text-raw-umber/50 font-body text-sm tracking-wide">{label}</p>
      )}
    </div>
  );
}

/**
 * Full-page loading screen with the brand loader and optional message.
 */
export function PageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-screen bg-warm-ivory noise-overlay flex flex-col items-center justify-center">
      {/* Decorative ornament above */}
      <div className="flex items-center gap-3 mb-8 opacity-30">
        <div className="w-8 h-px bg-deep-ochre" />
        <span className="text-deep-ochre text-xs font-mono tracking-[0.2em] uppercase">Prakash Duo</span>
        <div className="w-8 h-px bg-deep-ochre" />
      </div>

      <Loader size="48" label={label} />
    </div>
  );
}
