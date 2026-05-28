import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionConfig {
  id: string;
  type: string;
  count: number;
  marks: number;
}

const QuestionConfigSchema = new Schema<IQuestionConfig>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    count: { type: Number, required: true },
    marks: { type: Number, required: true },
  },
  { _id: false }
);

export interface IAssignment extends Document {
  title: string;
  instructions: string;
  totalMarks: number;
  questionConfigs: IQuestionConfig[];
  numberOfQuestions: number;
  timeAllowed: string;
  dueDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paperId?: mongoose.Types.ObjectId;
}

const AssignmentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    instructions: { type: String, required: false },
    totalMarks: { type: Number, required: true },
    questionConfigs: { type: [QuestionConfigSchema], required: true },
    numberOfQuestions: { type: Number, required: true },
    timeAllowed: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    paperId: { type: Schema.Types.ObjectId, ref: 'Paper' },
  },
  { timestamps: true }
);

const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
export default Assignment;