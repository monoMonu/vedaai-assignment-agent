export interface IQuestionConfig {
  id: string;
  type: string;
  count: number;
  marks: number;
}

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

export interface IPaper {
  _id?: string;
  assignmentId: string;
  sections: ISection[];
}

export interface IAssignment {
  _id?: string;
  title: string;
  instructions: string;
  totalMarks: number;
  questionConfigs: IQuestionConfig[];
  numberOfQuestions: number;
  timeAllowed: string;
  dueDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paperId?: string;
  createdAt: string;
}