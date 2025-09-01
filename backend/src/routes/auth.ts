import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      profile: { 
        name,
        level: 1,
        xp: 50, // Welcome bonus
        badges: ['Welcome Warrior'],
        streak: 1,
        streakLastUpdate: new Date(),
        totalSaved: 0,
        goalAchievements: 0
      }
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          preferences: user.preferences
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Error creating user account' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update login streak
    const now = new Date();
    const lastUpdate = new Date(user.profile.streakLastUpdate);
    const daysDiff = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff === 1) {
      user.profile.streak += 1;
      user.profile.xp += 5; // Daily login bonus
    } else if (daysDiff > 1) {
      user.profile.streak = 1;
    }
    
    user.profile.streakLastUpdate = now;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          preferences: user.preferences
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error during login' });
  }
});

// Get profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
});

export default router;