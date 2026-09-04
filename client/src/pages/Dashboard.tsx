import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Users, Briefcase, DollarSign, CheckSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import apiClient from '../api/client';

interface DashboardData {
  totalCustomers: number;
  activeDeals: number;
  revenue: number;
  pendingTasks: number;
  monthlyData: Array<{ month: string; customers: number }>;
  recentActivities: Array<{
    id: string;
    userName: string;
    description: string;
    createdAt: string;
  }>;
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiClient.get('/dashboard').then((response) => setData(response.data));
  }, []);

  if (!data) return <div>Loading...</div>;

  const metrics = [
    { label: 'Total Customers', value: data.totalCustomers.toLocaleString(), icon: Users, trend: '+12%', up: true },
    { label: 'Active Deals', value: data.activeDeals, icon: Briefcase, trend: '+5%', up: true },
    { label: 'Revenue', value: `$${(data.revenue / 1000000).toFixed(2)}M`, icon: DollarSign, trend: '-3%', up: false },
    { label: 'Tasks', value: `${data.pendingTasks} pending`, icon: CheckSquare, trend: '+8%', up: true },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">CRM Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{metric.label}</span>
              <metric.icon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
            <div className={`text-sm mt-2 ${metric.up ? 'text-green-600' : 'text-red-600'}`}>
              {metric.up ? <TrendingUp className="inline h-4 w-4" /> : <TrendingDown className="inline h-4 w-4" />}
              {' '}{metric.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Acquisition Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-600 mt-4">Monthly New Customers (Last 12 Months)</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="border-b pb-3">
                <p className="text-sm font-medium text-gray-800">{activity.userName}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};