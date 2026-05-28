import { Request, Response, NextFunction } from 'express';
import { assignmentQueue } from '../lib/queue';
import assignmentModel from '../models/assignment.model';

const getTimeAllowed = (marks: number) => {
  if(marks >= 60) {
    return '3 hours'
  } else if(marks >= 40) {
    return '2 hours'
  } else return '45 minutes'
}

const normalizeQuestionConfigs = (questionConfigs: unknown) => {
  if (typeof questionConfigs === 'string') {
    return JSON.parse(questionConfigs);
  }

  return questionConfigs;
};

export const getAssignments = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assignments = await assignmentModel
      .find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

export const getAssignmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assignment = await assignmentModel.findById(req.params.id).lean();

    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }

    res.json(assignment);
  } catch (error) {
    next(error);
  }
};

export const deleteAssignmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assignment = await assignmentModel.findByIdAndDelete({ _id: req.params.id });

    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }

    res.status(200).json({
      message: `Assignment: ${assignment?.title} Deleted Successfully.`
    });
  } catch (error) {
    next(error);
  }
}

export const createAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, instructions, totalMarks, questionConfigs, numberOfQuestions, dueDate } = req.body;
    const parsedQuestionConfigs = normalizeQuestionConfigs(questionConfigs);

    if (!title || !totalMarks || !parsedQuestionConfigs || !numberOfQuestions || !dueDate) {
       res.status(400).json({ message: "Missing required fields." });
       return;
    }

    if (!Array.isArray(parsedQuestionConfigs)) {
      res.status(400).json({ message: "questionConfigs must be an array." });
      return;
    }

    const newAssignment = await assignmentModel.create({
      title,
      instructions: instructions || "",
      totalMarks,
      questionConfigs: parsedQuestionConfigs,
      numberOfQuestions,
      timeAllowed: getTimeAllowed(totalMarks),
      dueDate,
      status: 'pending'
    });

    const job = await assignmentQueue.add('generate-paper', {
      assignmentId: newAssignment._id,
      title,
      instructions,
      totalMarks,
      questionConfigs: parsedQuestionConfigs,
      numberOfQuestions,
    });

    res.status(202).json({
      message: "Assignment generation started.",
      assignmentId: newAssignment._id,
      jobId: job.id,
      status: "pending"
    });

  } catch (error) {
    console.error(error)
    next(error); 
  }
};