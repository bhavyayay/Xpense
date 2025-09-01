"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User_1.default.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = new User_1.default({
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
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Error creating user account' });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
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
        }
        else if (daysDiff > 1) {
            user.profile.streak = 1;
        }
        user.profile.streakLastUpdate = now;
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Error during login' });
    }
});
// Get profile
router.get('/profile', auth_1.authMiddleware, async (req, res) => {
    try {
        const user = req.user;
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
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map