"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get transactions
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const transactions = await Transaction_1.default.find({ userId })
            .populate('goalId', 'title category')
            .sort({ date: -1 })
            .limit(50);
        res.json({
            success: true,
            message: 'Transactions retrieved successfully',
            data: transactions
        });
    }
    catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ success: false, message: 'Error fetching transactions' });
    }
});
// Add transaction
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { amount, category, description, date, type, paymentMethod, goalId } = req.body;
        const userId = req.user._id;
        const transaction = new Transaction_1.default({
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
        const user = await User_1.default.findById(userId);
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
    }
    catch (error) {
        console.error('Add transaction error:', error);
        res.status(500).json({ success: false, message: 'Error adding transaction' });
    }
});
exports.default = router;
//# sourceMappingURL=transactions.js.map