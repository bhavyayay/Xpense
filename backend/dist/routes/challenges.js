"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Challenge_1 = __importDefault(require("../models/Challenge"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get available challenges
router.get('/available', auth_1.authMiddleware, async (req, res) => {
    try {
        const challenges = await Challenge_1.default.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({
            success: true,
            message: 'Available challenges retrieved',
            data: challenges
        });
    }
    catch (error) {
        console.error('Get challenges error:', error);
        res.status(500).json({ success: false, message: 'Error fetching challenges' });
    }
});
// Seed challenges
router.post('/seed', async (req, res) => {
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
        await Challenge_1.default.deleteMany({});
        const created = await Challenge_1.default.insertMany(challenges);
        res.status(201).json({
            success: true,
            message: 'Challenges seeded successfully',
            data: created
        });
    }
    catch (error) {
        console.error('Seed challenges error:', error);
        res.status(500).json({ success: false, message: 'Error seeding challenges' });
    }
});
exports.default = router;
//# sourceMappingURL=challenges.js.map