import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CategoryEmissions } from '../../types';

interface CategoryChartProps {
  emissions: CategoryEmissions;
}

const CATEGORY_META: Record<keyof CategoryEmissions, { label: string; color: string }> = {
  transport: { label: 'Transport', color: '#2F8FBF' },
  electricity: { label: 'Electricity', color: '#E3A857' },
  food: { label: 'Food', color: '#6FBF8B' },
  water: { label: 'Water', color: '#5FD0C0' },
  waste: { label: 'Waste', color: '#E0735C' },
};

export default function CategoryChart({ emissions }: CategoryChartProps) {
  const data = useMemo(() => {
    return (Object.keys(emissions) as (keyof CategoryEmissions)[]).map((key) => ({
      name: CATEGORY_META[key].label,
      value: emissions[key],
      color: CATEGORY_META[key].color,
    }));
  }, [emissions]);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={3}
          cornerRadius={6}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(14,47,35,0.1)',
            borderRadius: 12,
            fontSize: 13,
          }}
          formatter={(value, name) => [`${value} kg CO₂e`, String(name)]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs text-ink/70">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
