import mongoose, { Schema, Document } from 'mongoose';

export interface Profile extends Document {
  userId: mongoose.Types.ObjectId;
  email?: string;
  fullName?: string;
  bio?: string;
  profileImage?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  skills: string[];
  experience?: string[];
  education?: string[];
  location?: string;
  createdAt: Date;
}

const profileSchema: Schema<Profile> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  email: { type: String, unique: true }, 
  fullName: { type: String },
  bio: { type: String },
  profileImage: { type: String }, // You can store image URL
  phone: { type: String },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
    portfolio: { type: String },
  },
  skills: [{ type: String }],
  experience: [{ type: String }],
  education: [{ type: String }],
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ProfileModel =
  (mongoose.models.Profile as mongoose.Model<Profile>) ||
  mongoose.model<Profile>('Profile', profileSchema);

export default ProfileModel;
