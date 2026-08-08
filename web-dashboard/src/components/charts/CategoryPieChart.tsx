'use client';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import api from '@/lib/api';

const CATEGORY_COLORS: Record<string, string> = {
  PHYSICAL_ABUSE: '#FF4B5C',
  SEXUAL_ABUSE: '#5B3FD3',
  EMOTIONAL_ABUSE: '#F59E0B',
  NEGLECT: '#8B6FF7',
  DOMESTIC_VIOLENCE: '#3B82F6',
  OTHER: '#6B7280',
};

const CATEGORY_LABELS: Record<string, string> = {
  PHYSICAL_ABUSE: 'Physical Abuse',
  SEXUAL_ABUSE: 'Sexual Abuse',
  EMOTIONAL_ABUSE: 'Emotional Abuse',
  NEGLECT: 'Neglect',
  DOMESTIC_VIOLENCE: 'Domestic Violence',
  OTHER: 'Other',
};

export function CategoryPieChart() {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    api.get('/analytics/reports-by-category')
      .then((res) => {
        const raw: { category: string; _count: number }[] = res.data;
        const mapped = raw.map((item) => ({
          name: CATEGORY_LABELS[item.category] ?? item.category,
          value: item._count,
          color: CATEGORY_COLORS[item.category] ?? '#6B7280',
        }));
        setData(mapped.length > 0 ? mapped : [{ name: 'No data', value: 1, color: '#E8E8F0' }]);
      })
      .catch(() => {
        setData([{ name: 'No data', value: 1, color: '#E8E8F0' }]);
      });
  }, []);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
