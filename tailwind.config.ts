import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Mitti & Gold brand colors
        gold: "hsl(var(--gold))",
        "rose-gold": "hsl(var(--rose-gold))",
        burgundy: "hsl(var(--burgundy))",
        champagne: "hsl(var(--champagne))",
        ivory: "hsl(var(--ivory))",
        charcoal: "hsl(var(--charcoal))",
        cream: "hsl(var(--cream))",
        // Direct hex for precision
        "warm-ivory": "#F5EFE0",
        "deep-ochre": "#C8882A",
        "raw-umber": "#3D2B1F",
        "blush-dust": "#EDD9C0",
        "crimson-thread": "#A0281A",
      },
      fontFamily: {
        display: ["var(--font-heading)", "Cormorant Garamond", "Georgia", "serif"],
        drama: ["var(--font-drama)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-body)", "DM Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Courier Prime", "Courier New", "monospace"],
        // Legacy compatibility
        sans: ["var(--font-body)", "DM Sans", "system-ui", "sans-serif"],
        serif: ["var(--font-heading)", "Cormorant Garamond", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "slide-in": "slideIn 0.5s ease-out",
        shimmer: "shimmer 3s ease-in-out infinite",
        float: "floatGentle 6s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        floatGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-gradient": "linear-gradient(135deg, #C8882A 0%, #D4A853 100%)",
        "dark-gradient": "linear-gradient(135deg, #3D2B1F 0%, #5A3D2B 100%)",
      },
      boxShadow: {
        luxury: "0 20px 40px -15px rgba(61, 43, 31, 0.15), 0 0 0 1px rgba(200, 136, 42, 0.1)",
        "luxury-lg": "0 30px 60px -20px rgba(61, 43, 31, 0.2), 0 0 0 1px rgba(200, 136, 42, 0.2)",
        glow: "0 0 40px -10px rgba(200, 136, 42, 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
