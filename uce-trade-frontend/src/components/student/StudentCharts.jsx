import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import ChartCard from '../common/ChartCard';

export const IncomeHistoryChart = ({ lineData }) => (
  <div style={{ marginBottom: '32px' }}> 
      <ChartCard title="Income History ($)" height={350}>
        <LineChart data={lineData.length > 0 ? lineData : [{name: 'No Data', income: 0}]}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
          <Line type="monotone" dataKey="income" stroke="#efb034" strokeWidth={4} dot={{ r: 4, fill: '#efb034', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
        </LineChart>
      </ChartCard>
  </div>
);

export const CategoryBarChart = ({ barData }) => (
  <ChartCard title="Sales by Category" height={400}>
      <BarChart data={barData.length > 0 ? barData : [{category: 'No Data', value: 0}]} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
        <XAxis type="number" hide />
        <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} width={80} />
        <Tooltip cursor={{fill: 'transparent'}} />
        <Bar dataKey="value" fill="#0d2149" radius={[0, 10, 10, 0]} barSize={20} />
      </BarChart>
  </ChartCard>
);