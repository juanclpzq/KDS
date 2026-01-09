/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // KDS semantic colors
        'kds-paid': '#3B82F6',      // Blue - order waiting
        'kds-progress': '#F59E0B',  // Amber - in preparation
        'kds-ready': '#10B981',     // Green - ready for pickup
        'kds-canceled': '#6B7280',  // Gray - canceled
        'kds-late': '#EF4444',      // Red - overdue
        'kds-bg': '#0F172A',        // Dark slate background
        'kds-card': '#1E293B',      // Card background
        'kds-border': '#334155',    // Border color
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
