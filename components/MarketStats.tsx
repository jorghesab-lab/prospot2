import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Hogar', demand: 85 },
  { name: 'Autos', demand: 65 },
  { name: 'Tech', demand: 90 },
  { name: 'Salud', demand: 50 },
  { name: 'Eventos', demand: 40 },
  { name: 'Negocios', demand: 30 },
];

export const MarketStats: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">Tendencias de Búsqueda</h3>
        <p className="text-sm text-slate-500">Categorías más solicitadas esta semana</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
            />
            <YAxis 
                hide={true}
            />
            <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar 
                dataKey="demand" 
                fill="#2563eb" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};