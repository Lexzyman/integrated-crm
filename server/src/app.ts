import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);

app.get('/api/dashboard', (req, res) => {
  res.json({
    totalCustomers: 12486,
    activeDeals: 87,
    revenue: 2340000,
    pendingTasks: 24,
    monthlyData: [
      { month: 'Jan', customers: 180 },
      { month: 'Feb', customers: 160 },
      { month: 'Mar', customers: 170 },
      { month: 'Apr', customers: 140 },
      { month: 'May', customers: 150 },
      { month: 'Jun', customers: 140 },
      { month: 'Jul', customers: 150 },
      { month: 'Aug', customers: 110 },
      { month: 'Sep', customers: 180 },
      { month: 'Oct', customers: 100 },
      { month: 'Nov', customers: 130 },
      { month: 'Dec', customers: 180 },
    ],
    recentActivities: [
      { id: '1', userName: 'Alex Chen', description: "Updated Deal 'Project Orion' status to 'Proposal Sent'", createdAt: '2 hours ago' },
      { id: '2', userName: 'Sarah Johnson', description: 'Added new customer: TechCorp Inc.', createdAt: '3 hours ago' },
      { id: '3', userName: 'Mike Peters', description: 'Completed call with Global Systems', createdAt: '5 hours ago' },
    ],
  });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: '1', name: 'Alex Chen', email: 'alex@crm.com', role: 'admin' },
    { id: '2', name: 'Jamie Lopez', email: 'jamie@crm.com', role: 'manager' },
    { id: '3', name: 'Taylor Kim', email: 'taylor@crm.com', role: 'sales_rep' },
  ]);
});