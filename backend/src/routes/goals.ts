import express, { Response } from 'express';
import mongoose from 'mongoose';
import Goal from '../models/Goal';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all goals
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Goals retrieved successfully',
      data: goals
    });

  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ success: false, message: 'Error fetching goals' });
  }
});

// Create goal
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, targetAmount, deadline, category } = req.body;
    const userId = req.user!._id;

    const goal = new Goal({
      userId,
      title,
      description,
      targetAmount,
      deadline,
      category,
      milestones: [
        { amount: targetAmount * 0.25, achieved: false, reward: '25% Progress' },
        { amount: targetAmount * 0.5, achieved: false, reward: '50% Progress' },
        { amount: targetAmount * 0.75, achieved: false, reward: '75% Progress' },
        { amount: targetAmount, achieved: false, reward: 'Goal Complete' }
      ]
    });

    await goal.save();

    // Award XP
    const user = await User.findById(userId);
    if (user) {
      user.profile.xp += 25;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: { goal, xpAwarded: 25 }
    });

  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ success: false, message: 'Error creating goal' });
  }
});

// Update goal progress
router.put('/:id/progress', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user!._id;
    
    const goal = await Goal.findOne({ _id: req.params.id, userId });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    goal.currentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
    
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
      goal.completedAt = new Date();
      
      // Award completion XP
      const user = await User.findById(userId);
      if (user) {
        user.profile.xp += 100;
        user.profile.goalAchievements += 1;
        await user.save();
      }
    }

    await goal.save();

    res.json({
      success: true,
      message: 'Goal progress updated',
      data: { goal }
    });

  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ success: false, message: 'Error updating goal' });
  }
});

export default router;