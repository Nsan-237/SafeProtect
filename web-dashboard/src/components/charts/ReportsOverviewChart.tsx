'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ReportsOverviewChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    api.get('/analytics/reports-by-time')
      .then((res) => {
        const raw: Record<string, number> = res.data;
        const mapped = Object.entries(raw).map(([month, count]) => ({
          name: MONTH_NAMES[Number(month)] ?? `M${month}`,
          value: count,
        }));
        setData(mapped.length > 0 ? mapped : [{ name: 'No data', value: 0 }]);
      })
      .catch(() => {
        // Fallback to empty chart
        setData([{ name: 'No data', value: 0 }]);
      });
  }, []);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#5B3FD3"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
