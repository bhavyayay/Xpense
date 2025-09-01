import express, { Response } from 'express';
import User from '../models/User';
import Goal from '../models/Goal';
import Transaction from '../models/Transaction';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get dashboard data
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const user = req.user!;

    // Get basic stats
    const activeGoals = await Goal.find({ userId, status: 'active' }).limit(5);
    const recentTransactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .populate('goalId', 'title');

    const dashboardData = {
      userStats: {
        profile: user.profile,
        preferences: user.preferences,
        nextLevelXP: (user.profile.level * 100) - user.profile.xp
      },
      activeGoals,
      recentTransactions,
      quickActions: [
        { type: 'transaction', label: 'Add Transaction', icon: '💰' },
        { type: 'goal', label: 'Create Goal', icon: '🎯' }
      ]
    };

    res.json({
      success: true,
      message: 'Dashboard data retrieved',
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard' });
  }
});

export default router;