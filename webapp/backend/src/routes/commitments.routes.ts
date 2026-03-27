import { Router } from 'express';
import { WorkspaceService } from '../services/workspace.service.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const commitments = await workspaceService.getCommitments();
    res.json({ success: true, commitments });
  } catch (error) {
    console.error('Error getting commitments:', error);
    res.status(500).json({ success: false, error: 'Failed to get commitments' });
  }
});

router.get('/commitments', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const commitments = await workspaceService.getCommitments();
    res.json({ success: true, commitments });
  } catch (error) {
    console.error('Error getting commitments:', error);
    res.status(500).json({ success: false, error: 'Failed to get commitments' });
  }
});

router.get('/initiatives', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const initiatives = await workspaceService.getInitiatives();
    res.json({ success: true, ...initiatives });
  } catch (error) {
    console.error('Error getting initiatives:', error);
    res.status(500).json({ success: false, error: 'Failed to get initiatives' });
  }
});

router.get('/people', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const people = await workspaceService.getPeople();
    res.json({ success: true, people });
  } catch (error) {
    console.error('Error getting people:', error);
    res.status(500).json({ success: false, error: 'Failed to get people' });
  }
});

export { router as dashboardRoutes };
