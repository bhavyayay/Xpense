import express, { Response } from 'express';
import Transaction from '../models/Transaction';
import Goal from '../models/Goal';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get transactions
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const transactions = await Transaction.find({ userId })
      .populate('goalId', 'title category')
      .sort({ date: -1 })
      .limit(50);

    res.json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: transactions
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
});

// Add transaction
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { amount, category, description, date, type, paymentMethod, goalId } = req.body;
    const userId = req.user!._id;

    const transaction = new Transaction({
      userId,
      goalId: goalId || undefined,
      amount,
      category,
      description,
      date: date || new Date(),
      type,
      paymentMethod,
      tags: []
    });

    await transaction.save();

    // Award XP
    const user = await User.findById(userId);
    if (user) {
      user.profile.xp += type === 'saving' ? 15 : 5;
      await user.save();
    }

    await transaction.populate('goalId', 'title category');

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: { transaction }
    });

  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ success: false, message: 'Error adding transaction' });
  }
});

export default router;