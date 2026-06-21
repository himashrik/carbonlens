/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canopy: '#0E2F23',   // deepest green — headings, nav
        moss: '#3F6B4F',     // mid green — body accents
        leaf: '#6FBF8B',     // bright green — primary actions
        sky: '#2F8FBF',      // blue — secondary actions, links
        aqua: '#5FD0C0',     // teal accent — highlights, charts
        mist: '#F6FAF8',     // off-white background
        ink: '#0F1F18',      // near-black text
        amber: '#E3A857',    // warning/medium difficulty
        coral: '#E0735C',    // high emission / danger
        
        // High-contrast accessible text colors (for light backgrounds)
        'leaf-text': '#2D6A4F',
        'aqua-text': '#006D77',
        'amber-text': '#A06A1A',
        'coral-text': '#C2410C',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'eco-gradient': 'linear-gradient(135deg, #0E2F23 0%, #1B4D3E 45%, #2F8FBF 100%)',
        'mist-gradient': 'linear-gradient(180deg, #F6FAF8 0%, #EAF4EF 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(14, 47, 35, 0.12)',
        'glass-lg': '0 20px 60px -10px rgba(14, 47, 35, 0.25)',
      },
      animation: {
        'grow-in': 'growIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        growIn: { '0%': { transform: 'scaleY(0)', opacity: 0 }, '100%': { transform: 'scaleY(1)', opacity: 1 } },
        fadeUp: { '0%': { transform: 'translateY(16px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}
