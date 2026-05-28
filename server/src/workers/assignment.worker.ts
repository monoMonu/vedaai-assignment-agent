import { Worker, Job } from 'bullmq';
import type { ConnectionOptions } from 'bullmq';
import Assignment from '../models/assignment.model';
import Paper, { IPaper } from '../models/paper.model';
import { redisConnection } from '../lib/queue';
import { getIO } from '../lib/socket';
import { generateQuestionPaper } from '../services/ai.service';

export const assignmentWorker = new Worker(
  'assignmentQueue',
  async (job: Job) => {
    const { assignmentId, title, instructions, totalMarks, numberOfQuestions, questionConfigs } = job.data;

    try {
      await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });

      const io = getIO();
      io.to(assignmentId).emit('generation-processing', {
        message: 'Assignment is now being processed.',
      });

      const aiGeneratedPaper = await generateQuestionPaper(
        title,
        instructions,
        totalMarks,
        numberOfQuestions,
        questionConfigs
      );

      const finalPaperData = {
        ...aiGeneratedPaper,
        assignmentId
      };

      const savedPaper = await Paper.create(finalPaperData as IPaper);

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: 'completed',
        paperId: savedPaper._id
      });

      io.to(assignmentId).emit("generation-completed", {
        message: "Your question paper is generated successfully.",
        paperId: savedPaper._id
      });

    } catch (error) {
      console.error(`Job Failed for Assignment ${job.data.assignmentId}:`, error);
      
      await Assignment.findByIdAndUpdate(job.data.assignmentId, { status: 'failed' });
      
      const io = getIO();
      io.to(job.data.assignmentId).emit("generation-failed", {
        message: "Failed to generate your question paper."
      });
      
      throw error;
    }
  },
  { 
    drainDelay: 60,
    connection: redisConnection as ConnectionOptions 
  }
);