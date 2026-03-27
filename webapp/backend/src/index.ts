import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { briefingRoutes } from './routes/briefing.routes.js';
import { todosRoutes } from './routes/todos.routes.js';
import { workspaceRoutes } from './routes/workspace.routes.js';
import { dashboardRoutes } from './routes/commitments.routes.js';

// Load .env from parent directory (webapp/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/briefing', briefingRoutes);
app.use('/api/todos', todosRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 PM Co-Pilot Backend running on http://localhost:${PORT}`);
  console.log(`📁 Workspace: ${process.env.WORKSPACE_PATH || 'Not set'}`);
  console.log(`🤖 AI: Claude via Cursor (no API key needed)`);
  console.log(`📄 Briefings: Reading from to_do's/briefings/`);
});
