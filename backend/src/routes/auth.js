import { Router } from 'express';
import { authService } from '../services/AuthService';
import { authMiddleware } from '../middleware/auth';
const router = Router();
router.post('/register', async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await authService.register(email, name, password);
        res.status(201).json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }
        const result = await authService.login(email, password);
        res.json(result);
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
});
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await authService.getUser(req.userId);
        res.json(user);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to fetch user' });
    }
});
export default router;
//# sourceMappingURL=auth.js.map