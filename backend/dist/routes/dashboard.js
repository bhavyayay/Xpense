"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Goal_1 = __importDefault(require("../models/Goal"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get dashboard data
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = req.user;
        // Get basic stats
        const activeGoals = await Goal_1.default.find({ userId, status: 'active' }).limit(5);
        const recentTransactions = await Transaction_1.default.find({ userId })
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
    }
    catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard' });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map