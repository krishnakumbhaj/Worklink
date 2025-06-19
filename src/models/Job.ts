import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IJob extends Document {
                                    userId: mongoose.Types.ObjectId;
                                    email: string;
                                    title: string;
                                    company: string;
                                    location: string;
                                    type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
                                    salary?: string;
                                    description: string;
                                    requirements?: string;
                                    benefits?: string;
                                    applicationDeadline?: string;
                                    experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior-level';
                                    remoteOption: 'Office-based' | 'Remote' | 'Hybrid';
                                    experience: 'Fresher' | '1-3 years' | '3+ years';
                                    createdAt: Date;
}

const JobSchema: Schema = new Schema<IJob>(
            {
                        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                        email: { type: String, required: true },
                                                                        title: { type: String, required: true },
                                                                        company: { type: String, required: true },
                                                                        location: { type: String, required: true },
                                                                        type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'], required: true },
                                                                        salary: { type: String },
                                                                        description: { type: String, required: true },
                                                                        requirements: { type: String },
                                                                        benefits: { type: String },
                                                                        applicationDeadline: { type: String },
                                                                        experienceLevel: { type: String, enum: ['Entry-level', 'Mid-level', 'Senior-level'], required: true, default: 'Entry-level' },
                                                                        remoteOption: { type: String, enum: ['Office-based', 'Remote', 'Hybrid'], required: true, default: 'Office-based' },
                                                                        experience: { type: String, enum: ['Fresher', '1-3 years', '3+ years'], required: true },
                                    },
                                    { timestamps: true }
);

export default models.Job || model<IJob>('Job', JobSchema);
