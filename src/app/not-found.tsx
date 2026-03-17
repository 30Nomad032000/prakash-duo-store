import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm-ivory flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">
          Page Not Found
        </p>
        <h1 className="font-display text-raw-umber text-6xl md:text-8xl font-bold mb-4">
          404
        </h1>
        <p className="font-body text-raw-umber/60 leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-body font-medium hover:bg-crimson-thread/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 border-2 border-raw-umber/20 text-raw-umber px-8 py-4 rounded-full font-body font-medium hover:border-deep-ochre hover:text-deep-ochre transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
