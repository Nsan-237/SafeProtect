'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Physical Abuse', value: 35, color: '#FF4B5C' },
  { name: 'Sexual Abuse', value: 25, color: '#5B3FD3' },
  { name: 'Emotional Abuse', value: 15, color: '#F59E0B' },
  { name: 'Neglect', value: 10, color: '#8B6FF7' },
  { name: 'Domestic Violence', value: 10, color: '#3B82F6' },
  { name: 'Others', value: 5, color: '#6B7280' },
];

export function CategoryPieChart() {
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
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
