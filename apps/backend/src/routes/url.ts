import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';
import { config } from '../config/env';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Shorten a URL
 */
router.post('/shorten', async (req: AuthenticatedRequest, res) => {
    const { url } = req.body;
    const userId = req.user?.userId || null;
    const shortId = Math.random().toString(36).substring(2, 8);

    const newUrl = await prisma.url.create({
        data: { original: url, short: shortId, userId }
    });

    res.json({ shortUrl: `${config.BASE_URL}/u/${shortId}` });
});

/**
 * @swagger
 * /u/{shortId}:
 *   get:
 *     summary: Redirect to the original URL
 */
router.get('/u/:shortId', async (req: Request, res: Response): Promise<void> => {
    const { shortId } = req.params;
    const url = await prisma.url.findUnique({ where: { short: shortId } });

    if (!url) {
        res.status(404).json({ error: 'URL not found' });
        return;
    }

    // Log the access
    await prisma.logEntry.create({
        data: {
            urlId: url.id,
            ipAddress: req.ip || '',
            userAgent: req.headers['user-agent'] || 'unknown'
        }
    });

    res.redirect(url.original);
});

export default router;
