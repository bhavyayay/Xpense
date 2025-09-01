import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  profile: {
    name: string;
    level: number;
    xp: number;
    badges: string[];
    streak: number;
    streakLastUpdate: Date;
    totalSaved: number;
    goalAchievements: number;
  };
  preferences: {
    currency: string;
    notifications: boolean;
    weeklyBudgetLimit: number;
  };
  createdAt: Date;
  lastLogin: Date;
}

const UserSchema: Schema = new Schema({
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
UserSchema.virtual('profile.calculatedLevel').get(function(this: IUser) {
  return Math.floor(this.profile.xp / 100) + 1;
});

export default mongoose.model<IUser>('User', UserSchema);