import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  projectId: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId; // Could be client or freelancer
  reviewee: mongoose.Types.ObjectId; // The person being reviewed
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
