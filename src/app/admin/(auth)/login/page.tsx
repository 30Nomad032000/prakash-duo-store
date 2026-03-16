'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Image (desktop: half screen, mobile: banner) */}
      <div className="relative lg:w-1/2 h-48 sm:h-64 lg:h-auto lg:min-h-screen flex-shrink-0">
        {/* Full-bleed cover image */}
        <Image
          src="/assets/cover page images website/Bangles.png"
          alt="Prakash Duo heritage bangles"
          fill
          className="object-cover"
          priority
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-raw-umber/90 via-raw-umber/40 to-raw-umber/20" />

        {/* Grain texture overlay */}
        <div className="hero-grain absolute inset-0" />

        {/* Mobile: compact brand mark */}
        <div className="lg:hidden absolute inset-0 flex items-center justify-center">
          <h2 className="font-display text-3xl text-warm-ivory tracking-wide">
            Prakash <span className="text-deep-ochre">Duo</span>
          </h2>
        </div>

        {/* Desktop: bottom brand mark + tagline */}
        <div className="hidden lg:flex absolute inset-x-0 bottom-0 flex-col items-center pb-16 px-8">
          {/* Pull quote / tagline */}
          <p className="font-drama italic text-warm-ivory/80 text-lg text-center leading-relaxed mb-10 max-w-sm">
            &ldquo;Where tradition meets timeless elegance, every piece tells a story of heritage.&rdquo;
          </p>

          {/* Decorative gold line */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-deep-ochre to-transparent mb-6" />

          {/* Brand mark */}
          <h2 className="font-display text-4xl text-warm-ivory tracking-wide">
            Prakash <span className="text-deep-ochre">Duo</span>
          </h2>

          <p className="font-mono text-warm-ivory/40 text-[10px] uppercase tracking-[0.35em] mt-3">
            Heritage Jewellery
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 bg-warm-ivory relative flex items-center justify-center px-6 py-12 lg:py-0">
        {/* Noise texture */}
        <div className="noise-overlay absolute inset-0" />

        <div className="w-full max-w-sm relative z-10">
          {/* Form header */}
          <div className="text-center mb-2">
            <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.3em] mb-4">
              Admin Dashboard
            </p>
            <h1 className="font-display text-raw-umber text-3xl">
              Welcome Back
            </h1>
          </div>

          {/* Gold divider ornament */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-deep-ochre/30" />
            <div className="w-1.5 h-1.5 rotate-45 bg-deep-ochre/40" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-deep-ochre/30" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-crimson-thread/5 border border-crimson-thread/20 text-crimson-thread px-4 py-3 rounded-xl text-sm font-body">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block font-mono text-raw-umber/60 text-xs uppercase tracking-[0.15em] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-raw-umber/10 rounded-xl px-4 py-3.5 font-body text-raw-umber placeholder:text-raw-umber/30 focus:border-deep-ochre focus:ring-2 focus:ring-deep-ochre/20 outline-none transition"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-mono text-raw-umber/60 text-xs uppercase tracking-[0.15em] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-raw-umber/10 rounded-xl px-4 py-3.5 font-body text-raw-umber placeholder:text-raw-umber/30 focus:border-deep-ochre focus:ring-2 focus:ring-deep-ochre/20 outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-crimson-thread text-warm-ivory rounded-full py-4 font-body font-medium press-effect hover:bg-crimson-thread/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-deep-ochre/20" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-raw-umber/40">
              Protected area
            </p>
            <div className="h-px w-8 bg-deep-ochre/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
