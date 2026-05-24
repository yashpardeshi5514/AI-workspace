import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { enterpriseService } from '../services/EnterpriseService';
import { asyncHandler } from '../middleware/errorHandler';
const router = Router();
// Analytics
router.get('/analytics', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId } = req.query;
    const { days = 30 } = req.query;
    if (!workspaceId) {
        res.status(400).json({ error: 'Workspace ID required' });
        return;
    }
    const analytics = await enterpriseService.getAnalytics(workspaceId, parseInt(days));
    res.json(analytics);
}));
router.post('/track', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId, event, data } = req.body;
    if (!workspaceId || !event) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    const metadata = {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    };
    await enterpriseService.trackEvent(workspaceId, req.userId, event, data, metadata);
    res.json({ success: true });
}));
// Team Management
router.post('/team/invite', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId, email, role } = req.body;
    if (!workspaceId || !email) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    const member = await enterpriseService.addTeamMember(workspaceId, email, role);
    // TODO: Send invite email
    res.status(201).json(member);
}));
router.get('/team', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId } = req.query;
    if (!workspaceId) {
        res.status(400).json({ error: 'Workspace ID required' });
        return;
    }
    const members = await enterpriseService.getTeamMembers(workspaceId);
    res.json(members);
}));
router.patch('/team/:memberId/role', authMiddleware, asyncHandler(async (req, res) => {
    const { memberId } = req.params;
    const { role } = req.body;
    if (!role) {
        res.status(400).json({ error: 'Role required' });
        return;
    }
    const member = await enterpriseService.updateMemberRole(memberId, role);
    res.json(member);
}));
// Integrations
router.post('/integrations', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId, type, name, config } = req.body;
    if (!workspaceId || !type || !name) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    const integration = await enterpriseService.createIntegration(workspaceId, type, name, config);
    res.status(201).json(integration);
}));
router.get('/integrations', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId } = req.query;
    if (!workspaceId) {
        res.status(400).json({ error: 'Workspace ID required' });
        return;
    }
    const integrations = await enterpriseService.getIntegrations(workspaceId);
    res.json(integrations);
}));
// Audit Log
router.get('/audit', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId } = req.query;
    if (!workspaceId) {
        res.status(400).json({ error: 'Workspace ID required' });
        return;
    }
    const logs = await enterpriseService.getAuditLog(workspaceId);
    res.json(logs);
}));
export default router;
//# sourceMappingURL=enterprise.js.map