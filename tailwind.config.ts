import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/stores/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1320px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Playfair Display", "serif"],
        note: ["var(--font-note)", "Lora", "serif"]
      },
      boxShadow: {
        paper: "0 22px 60px rgba(80, 56, 28, 0.16), inset 0 1px 0 rgba(255,255,255,0.72)",
        glass: "0 18px 45px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255,255,255,0.38)",
        glow: "0 0 0 1px rgba(255,255,255,0.28), 0 24px 80px rgba(37, 99, 235, 0.22)",
        leather: "0 28px 70px rgba(32, 18, 8, 0.30), inset 0 1px 1px rgba(255,255,255,0.18)"
      },
      keyframes: {
        "soft-float": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "page-curl": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(-8deg)" }
        },
        "ink-drop": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        "soft-float": "soft-float 7s ease-in-out infinite",
        shimmer: "shimmer 7s linear infinite",
        "page-curl": "page-curl 1.2s ease-in-out infinite alternate",
        "ink-drop": "ink-drop 220ms ease-out both"
      },
      borderRadius: {
        book: "1.45rem",
        paper: "1.15rem"
      }
    }
  },
  plugins: []
};

export default config;
