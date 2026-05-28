import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
  options?: string[];
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  sections: ISection[];
}

const QuestionSchema: Schema = new Schema({
  questionText: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
  marks: { type: Number, required: true },
  options: { type: [String], required: false },
});

const SectionSchema: Schema = new Schema({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true },
});

const PaperSchema: Schema = new Schema(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    sections: { type: [SectionSchema], required: true },
  },
  { timestamps: true }
);

const Paper = mongoose.model<IPaper>('Paper', PaperSchema);
export default Paper;