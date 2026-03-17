'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-warm-ivory flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-crimson-thread text-xs uppercase tracking-[0.2em] mb-4">
          Something went wrong
        </p>
        <h1 className="font-display text-raw-umber text-4xl md:text-5xl font-bold mb-4">
          Oops!
        </h1>
        <p className="font-body text-raw-umber/60 leading-relaxed mb-8">
          An unexpected error occurred. Please try again or contact us if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-body font-medium hover:bg-crimson-thread/90 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-raw-umber/20 text-raw-umber px-8 py-4 rounded-full font-body font-medium hover:border-deep-ochre hover:text-deep-ochre transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
