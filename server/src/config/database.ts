import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../data/crm.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export const initializeDatabase = async () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'manager', 'sales_rep')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      status TEXT NOT NULL CHECK(status IN ('active', 'inactive', 'pending')),
      industry TEXT,
      revenue REAL DEFAULT 0,
      employees INTEGER DEFAULT 0,
      last_contact DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      value REAL NOT NULL,
      stage TEXT NOT NULL CHECK(stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
      probability INTEGER DEFAULT 0,
      expected_close_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      customer_id TEXT,
      deal_id TEXT,
      assigned_to TEXT NOT NULL,
      due_date DATETIME NOT NULL,
      priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
      status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
      FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL,
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('call', 'email', 'meeting', 'note')),
      description TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Seed default admin user
  const bcrypt = require('bcryptjs');
  const { v4: uuidv4 } = require('uuid');
  
  const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@crm.com');
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(
      uuidv4(), 'admin@crm.com', hashedPassword, 'Admin User', 'admin'
    );
  }

  console.log('Database initialized');
};

export default db;