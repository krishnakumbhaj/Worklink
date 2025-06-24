import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  userId: mongoose.Types.ObjectId; // we reference User
  username: string;
  profileImage?: string;
  message: string;
  createdAt: Date;
}

const TestimonialSchema: Schema<ITestimonial> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  profileImage: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TestimonialModel =
  (mongoose.models.Testimonial as mongoose.Model<ITestimonial>) ||
  mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default TestimonialModel;
