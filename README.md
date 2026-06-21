# 🍃 CarbonLens — Carbon Footprint Awareness Platform

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev)
[![Vitest](https://img.shields.io/badge/Vitest-Unit_Tests-7A9B57.svg?logo=vitest&logoColor=white)](https://vitest.dev)
[![A11y Compliant](https://img.shields.io/badge/Accessibility-WCAG_AA-brightgreen)](https://www.w3.org/WAI/standards-guidelines/wcag/)

CarbonLens is a sleek, single-page React application that empowers households to calculate, analyze, and systematically reduce their monthly carbon footprint. Featuring a premium glassmorphic dashboard, responsive charts, and an interactive goal tracker, CarbonLens helps users understand their environmental impact with immediate feedback.

**Zero Backend.** All calculation results, history, and goals are stored securely in the browser's `LocalStorage` — no data ever leaves the user's device.

---

## ✨ Features & Highlights

- **Interactive Eco Calculator:** Answer six simple questions about your daily travel, grid energy, diet preference, water use, and waste habits.
- **Concentric "Eco Ring" Gauge:** A signature visual element inspired by tree growth rings that displays the overall sustainability score (0–100).
- **Interactive Dashboards:** Track your monthly emissions trend and view a category-wise distribution donut chart using responsive Recharts graphs.
- **Dynamic Action Plans:** Personalized suggestions filtered and sorted dynamically to show high-impact, easy-to-implement actions first.
- **Goal & Milestone Tracking:** Lock in a target reduction rate (e.g., 20% or 30%) and a timeframe (1 to 12 months) to see real-time progress bars update as habits improve.

---

## 🚀 Hackathon Quality Optimizations

To prepare for final evaluation, the codebase has been optimized across five performance and compliance pillars:

| Pillar | Optimization Implemented | Benefit |
|---|---|---|
| **♿ Accessibility (a11y)** | Redesigned low-contrast labels with WCAG AA compliant colors (contrast ratio > 4.5:1). Refactored nested form structures to use separate semantic `<fieldset>`s and `<legend>`s. | Screen-reader and high-contrast friendly navigation. |
| **⚡ Performance** | Implemented `useMemo` hooks to memoize expensive score averages, chart arrays, and sorting operations. | Zero redundant re-computations or layout recalculations. |
| **🔒 Security & Safety** | Implemented schema verification inside LocalStorage helpers to filter out malformed or corrupted payloads. | Complete protection against browser database corruption crashes. |
| **🧪 Testing** | Added a full unit testing suite using `Vitest` to cover all formulas, scoring weight combinations, and recommendations. | High code coverage and guaranteed logic correctness. |
| **📐 Purity** | Resolved React Hooks linter exceptions in the Goals engine by shifting dynamic render-time evaluations (`Date.now()`) to stable states. | Predictable, pure renders. |

---

## 📊 Carbon Calculation Formulas

All formulas normalize to **kg CO₂e per month**. Constants are located in `src/data/emissionFactors.ts` and calculation logic in `src/utils/carbonCalculator.ts`:

| Category | Formula | Reference Factor |
|---|---|---|
| 🚗 **Transport** | `daily_km × factor[transport_type] × 30` | Petrol Car: `0.192 kg/km`, Electric: `0.053 kg/km` |
| ⚡ **Electricity** | `monthly_kWh × 0.475` | Global average grid mix |
| 🍔 **Food** | `factor[diet] × 30` | Meat-heavy: `7.19 kg/day`, Vegan: `2.89 kg/day` |
| 💧 **Water** | `daily_liters × 0.000298 × 30` | Treatment, distribution, and heating share |
| 🗑️ **Waste** | `factor[level] × 4.345` | High waste: `4.8 kg/week`, Low waste: `1.1 kg/week` |

---

## 📈 Sustainability Score Weights

Individual scores are calculated by linearly interpolating the user's footprint between **Ideal** (100 pts) and **Poor** (0 pts) benchmarks, then combined using specific weights:

- **Transport:** 30% weight (Ideal: `10 kg/mo`, Poor: `250 kg/mo`)
- **Electricity:** 25% weight (Ideal: `40 kg/mo`, Poor: `300 kg/mo`)
- **Food:** 20% weight (Ideal: `85 kg/mo`, Poor: `220 kg/mo`)
- **Water:** 15% weight (Ideal: `2 kg/mo`, Poor: `15 kg/mo`)
- **Waste:** 10% weight (Ideal: `3 kg/mo`, Poor: `25 kg/mo`)

---

## 📁 Directory Architecture

```
carbon-app/
├── public/
│   └── leaf.svg                   # App favicon
├── src/
│   ├── components/
│   │   ├── calculator/
│   │   │   └── CalculatorForm.tsx # Semantic form controls
│   │   ├── charts/
│   │   │   ├── TrendChart.tsx     # Monthly footprint trends (AreaChart)
│   │   │   └── CategoryChart.tsx  # Category distribution donut (PieChart)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Responsive navigation shell
│   │   │   └── Footer.tsx         # Pure-rendering copyright footer
│   │   ├── ui/
│   │   │   ├── GlassCard.tsx      # Recyclable glassmorphic wrapper
│   │   │   ├── ScoreRing.tsx      # SVG-driven eco gauge
│   │   │   └── Atoms.tsx          # Status badges & loading/empty states
│   │   ├── InsightsPanel.tsx      # Top and bottom performer analysis
│   │   └── RecommendationCard.tsx # High-contrast action cards
│   ├── data/
│   │   ├── emissionFactors.ts     # Verified conversion constants
│   │   └── mockData.ts            # Historical calculation generator
│   ├── hooks/
│   │   └── useAppData.ts          # Central LocalStorage React sync state
│   ├── pages/
│   │   ├── Landing.tsx            # Clean showcase page
│   │   ├── Calculator.tsx         # Stepped carbon calculation engine
│   │   ├── Dashboard.tsx          # Interactive charts & history logs
│   │   └── Goals.tsx              # Goal planning & progress tracking
│   ├── types/
│   │   └── index.ts               # Shared TypeScript schemas
│   ├── utils/
│   │   ├── carbonCalculator.ts    # Normalized emissions engine
│   │   ├── scoring.ts             # Sustainable rating compiler
│   │   ├── recommendations.ts     # Dynamic tips ordering engine
│   │   ├── insights.ts            # Strengths & weaknesses evaluator
│   │   └── storage.ts             # Safe parsing LocalStorage wrapper
│   ├── App.tsx                    # React router maps & layout shell
│   └── main.tsx                   # Render entrypoint
├── tailwind.config.js             # Customized design tokens & color schemes
├── package.json                   # NPM package scripts & dependencies
└── vercel.json                    # Single Page App refresh routing rules
```

---

## 🛠️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org) installed on your system.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

3. **Run the test suite:**
   ```bash
   npm run test
   ```
   This runs the Vitest engine to verify calculation formulas and recommendations.

4. **Verify quality & lint compliance:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```
   This type-checks code and compiles static assets to the `/dist` directory.

---

