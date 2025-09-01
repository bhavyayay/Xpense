"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        name: { type: String, required: true },
        level: { type: Number, default: 1 },
        xp: { type: Number, default: 0 },
        badges: [{ type: String }],
        streak: { type: Number, default: 0 },
        streakLastUpdate: { type: Date, default: Date.now },
        totalSaved: { type: Number, default: 0 },
        goalAchievements: { type: Number, default: 0 }
    },
    preferences: {
        currency: { type: String, default: '₹' },
        notifications: { type: Boolean, default: true },
        weeklyBudgetLimit: { type: Number, default: 5000 }
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});
// Calculate level based on XP
UserSchema.virtual('profile.calculatedLevel').get(function () {
    return Math.floor(this.profile.xp / 100) + 1;
});
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map