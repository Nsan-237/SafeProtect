'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'May 1', value: 10 },
  { name: 'May 5', value: 15 },
  { name: 'May 10', value: 25 },
  { name: 'May 15', value: 20 },
  { name: 'May 20', value: 35 },
  { name: 'May 25', value: 30 },
  { name: 'May 31', value: 45 },
];

export function ReportsOverviewChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#5B3FD3" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
