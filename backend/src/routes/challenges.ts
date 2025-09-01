import express, { Request, Response } from 'express';
import Challenge from '../models/Challenge';
import UserChallenge from '../models/UserChallenge';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get available challenges
router.get('/available', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Available challenges retrieved',
      data: challenges
    });

  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ success: false, message: 'Error fetching challenges' });
  }
});

// Seed challenges
router.post('/seed', async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const challenges = [{
      title: "Save ₹1000 This Week",
      description: "Save at least ₹1000 in 7 days",
      type: "weekly",
      category: "saving",
      targetValue: 1000,
      unit: "rupees",
      startDate: now,
      endDate: nextWeek,
      rewards: { xp: 100 },
      difficulty: "easy",
      isActive: true,
      participants: []
    }];

    await Challenge.deleteMany({});
    const created = await Challenge.insertMany(challenges);

    res.status(201).json({
      success: true,
      message: 'Challenges seeded successfully',
      data: created
    });

  } catch (error) {
    console.error('Seed challenges error:', error);
    res.status(500).json({ success: false, message: 'Error seeding challenges' });
  }
});

export default router;