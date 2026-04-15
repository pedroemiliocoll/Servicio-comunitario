import tailwindAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Material Design 3 semantic tokens (auto-switch light/dark via CSS vars) ── */
        "surface":                    "var(--md-surface)",
        "surface-dim":                "var(--md-surface-dim)",
        "surface-bright":             "var(--md-surface-bright)",
        "surface-container-lowest":   "var(--md-surface-container-lowest)",
        "surface-container-low":      "var(--md-surface-container-low)",
        "surface-container":          "var(--md-surface-container)",
        "surface-container-high":     "var(--md-surface-container-high)",
        "surface-container-highest":  "var(--md-surface-container-highest)",
        "surface-variant":            "var(--md-surface-variant)",
        "surface-tint":               "var(--md-surface-tint)",
        "background":                 "var(--md-background)",

        "on-surface":                 "var(--md-on-surface)",
        "on-surface-variant":         "var(--md-on-surface-variant)",
        "on-background":              "var(--md-on-background)",

        "primary":                    "var(--md-primary)",
        "primary-container":          "var(--md-primary-container)",
        "on-primary":                 "var(--md-on-primary)",
        "on-primary-container":       "var(--md-on-primary-container)",
        "primary-fixed":              "var(--md-primary-fixed)",
        "primary-fixed-dim":          "var(--md-primary-fixed-dim)",

        "secondary":                  "var(--md-secondary)",
        "secondary-container":        "var(--md-secondary-container)",
        "on-secondary":               "var(--md-on-secondary)",
        "on-secondary-container":     "var(--md-on-secondary-container)",
        "secondary-fixed":            "var(--md-secondary-fixed)",
        "secondary-fixed-dim":        "var(--md-secondary-fixed-dim)",

        "tertiary":                   "var(--md-tertiary)",
        "tertiary-container":         "var(--md-tertiary-container)",
        "on-tertiary":                "var(--md-on-tertiary)",
        "on-tertiary-container":      "var(--md-on-tertiary-container)",
        "tertiary-fixed":             "var(--md-tertiary-fixed)",
        "tertiary-fixed-dim":         "var(--md-tertiary-fixed-dim)",

        "error":                      "var(--md-error)",
        "error-container":            "var(--md-error-container)",
        "on-error":                   "var(--md-on-error)",
        "on-error-container":         "var(--md-on-error-container)",

        "outline":                    "var(--md-outline)",
        "outline-variant":            "var(--md-outline-variant)",

        "inverse-surface":            "var(--md-inverse-surface)",
        "inverse-on-surface":         "var(--md-inverse-on-surface)",
        "inverse-primary":            "var(--md-inverse-primary)",

        "on-primary-fixed":           "#001a41",
        "on-primary-fixed-variant":   "#004493",
        "on-secondary-fixed":         "#091c35",
        "on-secondary-fixed-variant": "#374763",
        "on-tertiary-fixed":          "#341100",
        "on-tertiary-fixed-variant":  "#783100",

        /* Admin-specific tokens */
        "admin-bg":             "var(--admin-bg)",
        "admin-card":           "var(--admin-card)",
        "admin-text":           "var(--admin-text-primary)",
        "admin-text-secondary": "var(--admin-text-secondary)",
        "admin-text-muted":     "var(--admin-text-muted)",
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "3xl": "1.5rem", "full": "9999px"
      },
    },
  },
  plugins: [
    tailwindAnimate,
  ],
}
