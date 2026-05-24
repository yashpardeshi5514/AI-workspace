import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { codeExecutor } from '../services/CodeExecutor';
import { asyncHandler } from '../middleware/errorHandler';
const router = Router();
// Execute code
router.post('/execute', authMiddleware, asyncHandler(async (req, res) => {
    const { code, language } = req.body;
    if (!code || !language) {
        res.status(400).json({ error: 'Code and language required' });
        return;
    }
    const result = await codeExecutor.execute(code, language);
    res.json(result);
}));
// Supported languages
router.get('/languages', (_req, res) => {
    res.json({
        supported: ['javascript', 'python', 'node'],
        details: {
            javascript: {
                timeout: 5000,
                sandbox: true,
                description: 'JavaScript (VM sandbox)',
            },
            python: {
                timeout: 5000,
                sandbox: true,
                description: 'Python 3',
            },
            node: {
                timeout: 5000,
                sandbox: true,
                description: 'Node.js',
            },
        },
    });
});
export default router;
//# sourceMappingURL=execute.js.map