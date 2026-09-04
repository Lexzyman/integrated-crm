import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.get('/', authenticate, (req: AuthRequest, res) => {
  const customers = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
  res.json(customers);
});

router.get('/:id', authenticate, (req: AuthRequest, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  res.json(customer);
});

router.post('/', authenticate, authorize('admin', 'manager'), (req: AuthRequest, res) => {
  const { name, company, email, phone, status, industry, revenue, employees } = req.body;
  const id = uuidv4();

  db.prepare(`
    INSERT INTO customers (id, name, company, email, phone, status, industry, revenue, employees)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, company, email, phone, status, industry, revenue || 0, employees || 0);

  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  res.status(201).json(customer);
});

router.put('/:id', authenticate, authorize('admin', 'manager'), (req: AuthRequest, res) => {
  const { name, company, email, phone, status, industry, revenue, employees } = req.body;

  db.prepare(`
    UPDATE customers 
    SET name = ?, company = ?, email = ?, phone = ?, status = ?, industry = ?, revenue = ?, employees = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, company, email, phone, status, industry, revenue, employees, req.params.id);

  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  res.json(customer);
});

router.delete('/:id', authenticate, authorize('admin'), (req: AuthRequest, res) => {
  db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

router.get('/:id/activities', authenticate, (req: AuthRequest, res) => {
  const activities = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM activities a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.customer_id = ? 
    ORDER BY a.created_at DESC
  `).all(req.params.id);
  res.json(activities);
});

router.get('/:id/deals', authenticate, (req: AuthRequest, res) => {
  const deals = db.prepare('SELECT * FROM deals WHERE customer_id = ?').all(req.params.id);
  res.json(deals);
});

export default router;