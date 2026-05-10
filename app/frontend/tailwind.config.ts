import type { Config } from "tailwindcss";

// pickyeat brand tokens — keep in sync with /brand/brand-guide.md
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: "#F26B3A",   // primary brand
        spice:   "#C8421C",   // depth, hover, large display
        sprig:   "#2BB673",   // the pick — dot motif only
        pepper:  "#1F1B16",   // text, warm-black
        coconut: "#FFF8EE"    // surfaces, warm-cream
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
        indic: ["'Mukta'", "'Plus Jakarta Sans'", "sans-serif"]
      },
      borderRadius: {
        card:  "12px",
        panel: "16px",
        sheet: "20px"
      },
      letterSpacing: {
        eyebrow: "0.18em"
      },
      borderWidth: {
        hair: "0.5px"
      }
    }
  },
  plugins: []
};

export default config;
