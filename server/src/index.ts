import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { initializeDatabase } from './config/database';

const PORT = process.env.PORT || 3001;

async function start() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(console.error);