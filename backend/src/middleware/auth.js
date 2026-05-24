import { AuthService } from '../services/AuthService';
export function authMiddleware(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = header.substring(7);
        const payload = AuthService.verifyToken(token);
        req.userId = payload.userId;
        req.email = payload.email;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
//# sourceMappingURL=auth.js.map