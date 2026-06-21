import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { CalculationResult } from '../../types';

interface TrendChartProps {
  data: CalculationResult[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((c) => ({
        date: new Date(c.date).toLocaleDateString('en-US', { month: 'short' }),
        total: c.totalMonthlyKg,
      }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6FBF8B" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#6FBF8B" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#0E2F23" strokeOpacity={0.06} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#3F6B4F' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#3F6B4F' }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          contentStyle={{
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(14,47,35,0.1)',
            borderRadius: 12,
            fontSize: 13,
          }}
          formatter={(value) => [`${value} kg CO₂e`, 'Total']}
        />
        <Area type="monotone" dataKey="total" stroke="#3F6B4F" strokeWidth={2.5} fill="url(#trendFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
