import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { IncomeData } from '../types';

interface IncomeChartProps {
  data: IncomeData[];
}

export const IncomeChart: React.FC<IncomeChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorSide" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGig" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                borderColor: '#334155',
                borderRadius: '0.5rem',
                color: '#cbd5e1'
            }}
            cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
          />
          <Legend wrapperStyle={{fontSize: '12px'}} />
          <Area type="monotone" dataKey="sideBusiness" name="Side Business" stackId="1" stroke="#f59e0b" fill="url(#colorSide)" />
          <Area type="monotone" dataKey="solarCareer" name="Solar Career" stackId="1" stroke="#8b5cf6" fill="url(#colorSolar)" />
          <Area type="monotone" dataKey="gigWork" name="Gig Work" stackId="1" stroke="#3b82f6" fill="url(#colorGig)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
