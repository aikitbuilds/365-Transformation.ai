import React from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts';
import { IncomeData } from '../types';

interface IncomeChartProps {
  data: IncomeData[];
}

export const IncomeChart: React.FC<IncomeChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '0.5rem'
            }} 
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Area type="monotone" dataKey="sideBusiness" stackId="1" stroke="#f59e0b" fill="url(#colorSide)" />
          <Area type="monotone" dataKey="solarCareer" stackId="1" stroke="#8b5cf6" fill="url(#colorSolar)" />
          <Area type="monotone" dataKey="gigWork" stackId="1" stroke="#3b82f6" fill="url(#colorGig)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};