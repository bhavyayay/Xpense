"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStreak = exports.awardBadge = exports.awardXP = exports.BADGES = exports.XP_REWARDS = void 0;
const User_1 = __importDefault(require("../models/User"));
exports.XP_REWARDS = {
    REGISTER: 50,
    DAILY_LOGIN: 5,
    STREAK_BONUS: 10,
    CREATE_GOAL: 25,
    COMPLETE_GOAL: 100,
    ADD_TRANSACTION: 5,
    SAVE_MONEY: 10,
    COMPLETE_CHALLENGE: 50,
    MILESTONE_REACHED: 30,
    WEEK_BUDGET_MET: 40,
    MONTH_SAVINGS_GOAL: 75
};
exports.BADGES = {
    WELCOME: 'Welcome Warrior',
    GOAL_SETTER: 'Goal Setter',
    ACHIEVEMENT_HUNTER: 'Achievement Hunter',
    SAVING_MASTER: 'Saving Master',
    TRANSACTION_TRACKER: 'Transaction Tracker',
    STREAK_CHAMPION: 'Streak Champion',
    BUDGET_NINJA: 'Budget Ninja',
    INVESTMENT_PRO: 'Investment Pro',
    CHALLENGE_CONQUEROR: 'Challenge Conqueror',
    FINANCIAL_GURU: 'Financial Guru'
};
const awardXP = async (userId, xpAmount, reason) => {
    try {
        const userIdString = userId.toString();
        const user = await User_1.default.findById(userIdString);
        if (!user)
            return null;
        const oldLevel = Math.floor(user.profile.xp / 100) + 1;
        user.profile.xp += xpAmount;
        const newLevel = Math.floor(user.profile.xp / 100) + 1;
        const leveledUp = newLevel > oldLevel;
        if (leveledUp) {
            user.profile.level = newLevel;
        }
        await user.save();
        return {
            xpAwarded: xpAmount,
            totalXP: user.profile.xp,
            leveledUp,
            newLevel: leveledUp ? newLevel : null,
            reason
        };
    }
    catch (error) {
        console.error('Error awarding XP:', error);
        return null;
    }
};
exports.awardXP = awardXP;
const awardBadge = async (userId, badgeName) => {
    try {
        const userIdString = userId.toString();
        const user = await User_1.default.findById(userIdString);
        if (!user || user.profile.badges.includes(badgeName)) {
            return null;
        }
        user.profile.badges.push(badgeName);
        await user.save();
        return {
            badgeAwarded: badgeName,
            totalBadges: user.profile.badges.length
        };
    }
    catch (error) {
        console.error('Error awarding badge:', error);
        return null;
    }
};
exports.awardBadge = awardBadge;
const updateStreak = async (userId) => {
    try {
        const userIdString = userId.toString();
        const user = await User_1.default.findById(userIdString);
        if (!user)
            return null;
        const now = new Date();
        const lastUpdate = new Date(user.profile.streakLastUpdate);
        const timeDiff = now.getTime() - lastUpdate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        if (daysDiff === 1) {
            user.profile.streak += 1;
            await (0, exports.awardXP)(userIdString, exports.XP_REWARDS.STREAK_BONUS, 'Daily streak bonus');
        }
        else if (daysDiff > 1) {
            user.profile.streak = 1;
        }
        user.profile.streakLastUpdate = now;
        await user.save();
        return {
            currentStreak: user.profile.streak,
            streakMaintained: daysDiff <= 1
        };
    }
    catch (error) {
        console.error('Error updating streak:', error);
        return null;
    }
};
exports.updateStreak = updateStreak;
//# sourceMappingURL=xpSystem.js.map