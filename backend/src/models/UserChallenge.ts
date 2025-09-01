// backend/src/models/UserChallenge.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUserChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  rewardsClaimed: boolean;
}

const UserChallengeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'failed', 'abandoned'], 
    default: 'active' 
  },
  progress: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  rewardsClaimed: { type: Boolean, default: false }
});

export default mongoose.model<IUserChallenge>('UserChallenge', UserChallengeSchema);