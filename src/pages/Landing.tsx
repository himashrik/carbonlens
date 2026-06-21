import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, LineChart, Sparkles, Target, Car, Zap, Droplet, Trash2 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ScoreRing from '../components/ui/ScoreRing';

const BENEFITS = [
  {
    icon: Calculator,
    title: 'Precise Calculations',
    description: 'Real emission factors across travel, energy, food, water, and waste — not guesswork.',
  },
  {
    icon: LineChart,
    title: 'Visual Dashboards',
    description: 'Watch your footprint trend over time and see exactly where your emissions come from.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Tips',
    description: 'Recommendations ranked by impact, so you always know your next best move.',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Set a reduction target and watch your progress fill in as you make changes.',
  },
];

const STEPS = [
  { title: 'Answer 6 quick questions', detail: 'Travel, energy, food, water, and waste habits — under 2 minutes.' },
  { title: 'Get your Eco Score', detail: 'A 0–100 sustainability score benchmarked against real-world data.' },
  { title: 'Act on ranked tips', detail: 'Each recommendation shows its difficulty and potential CO₂ savings.' },
];

export default function Landing() {
  return (
    <div className="px-3 sm:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-eco-gradient mt-4 sm:mt-6">
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden>
          <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-leaf blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-sky blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-10 items-center px-6 sm:px-12 py-16 sm:py-24">
          <div className="space-y-6 animate-fade-up">
            <span className="label-eyebrow text-leaf">Carbon Footprint Awareness Platform</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-mist leading-[1.05]">
              See your impact.<br />
              <span className="text-leaf">Shrink</span> it, one ring at a time.
            </h1>
            <p className="text-mist/70 text-lg max-w-lg">
              CarbonLens turns your daily habits — how you travel, eat, and live — into a clear monthly CO₂e
              number and a sustainability score you can actually improve.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/calculator" className="btn-primary">
                Calculate My Footprint <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/dashboard" className="btn-secondary !text-mist !border-white/20 hover:!border-leaf hover:!text-leaf">
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="glass-card-dark p-8 flex flex-col items-center gap-4">
              <ScoreRing score={74} size={200} sublabel="Sample result" />
              <p className="text-xs text-mist/50 font-mono text-center max-w-[180px]">
                Your Eco Score updates instantly after every calculation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview / category strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
        {[
          { icon: Car, label: 'Transport' },
          { icon: Zap, label: 'Electricity' },
          { icon: Droplet, label: 'Water' },
          { icon: Trash2, label: 'Waste' },
        ].map((item) => (
          <GlassCard key={item.label} className="flex flex-col items-center gap-2 !py-5">
            <item.icon className="w-5 h-5 text-moss" />
            <span className="text-sm font-medium text-ink/70">{item.label}</span>
          </GlassCard>
        ))}
      </section>

      {/* Benefits */}
      <section className="mt-20">
        <div className="max-w-xl mb-10">
          <span className="label-eyebrow">Why CarbonLens</span>
          <h2 className="text-3xl font-display font-semibold mt-2">Everything you need to understand your footprint</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((b) => (
            <GlassCard key={b.title} className="flex flex-col gap-3">
              <span className="w-11 h-11 rounded-2xl bg-sky/15 flex items-center justify-center">
                <b.icon className="w-5 h-5 text-sky" />
              </span>
              <h3 className="font-display text-lg font-semibold text-canopy">{b.title}</h3>
              <p className="text-sm text-ink/60">{b.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-20">
        <div className="max-w-xl mb-10">
          <span className="label-eyebrow">How it works</span>
          <h2 className="text-3xl font-display font-semibold mt-2">Three steps to a clearer picture</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <GlassCard key={step.title} className="relative">
              <span className="font-mono text-sm text-leaf/80">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-lg font-semibold text-canopy mt-2">{step.title}</h3>
              <p className="text-sm text-ink/60 mt-1.5">{step.detail}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-20 mb-4">
        <div className="glass-card-dark rounded-3xl px-8 sm:px-16 py-14 text-center flex flex-col items-center gap-5">
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-mist max-w-xl">
            Your footprint takes two minutes to measure.
          </h2>
          <p className="text-mist/60 max-w-md">No sign-up, no servers — everything stays on your device.</p>
          <Link to="/calculator" className="btn-primary">
            Start Your Calculation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
