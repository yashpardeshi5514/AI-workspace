// Backend health check endpoint
import { Router } from 'express';
const router = Router();
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
router.get('/ready', async (_req, res) => {
    try {
        // Check database connection
        const isReady = true; // Add actual DB check here
        if (!isReady) {
            return res.status(503).json({
                status: 'not_ready',
                message: 'Service dependencies not ready',
            });
        }
        res.json({
            status: 'ready',
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        res.status(503).json({
            status: 'not_ready',
            error: 'Service unavailable',
        });
    }
});
export default router;
//# sourceMappingURL=health.js.map