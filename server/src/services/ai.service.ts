import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import { GROQ_API_KEY } from "../config";

const llm = new ChatGroq({
  apiKey: GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.2,
});

const QuestionSchema = z.object({
  questionText: z.string().describe("The actual question text."),
  difficulty: z.enum(["Easy", "Moderate", "Hard"]).describe("The difficulty level of the question."),
  marks: z.number().describe("The marks allocated for this specific question."),
  options: z.array(z.string()).length(4).optional().describe("Four MCQ options when the question type is multiple choice."),
});

const SectionSchema = z.object({
  title: z.string().describe("The title of the section, e.g., 'Section A: Multiple Choice'"),
  instruction: z.string().describe("Instructions for this section, e.g., 'Attempt all questions.'"),
  questions: z.array(QuestionSchema).describe("The list of questions belonging to this section."),
});

const PaperSchema = z.object({
  sections: z.array(SectionSchema).describe("The different sections making up the exam paper."),
});

const extractJson = (content: string) => {
  const trimmed = content.trim();

  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return trimmed;
};

export const generateQuestionPaper = async (
  title: string,
  instructions: string,
  totalMarks: number,
  numberOfQuestions: number,
  questionConfigs: any[]
) => {
  const configString = questionConfigs
    .map((c) => `${c.count} questions of type '${c.type}' (${c.marks} marks each)`)
    .join("\n- ");

  const prompt = `You are an expert academic curriculum designer.
Generate a high-quality exam paper based on the following exact specifications and return only valid JSON with this exact shape:

{
  "sections": [
    {
      "title": string,
      "instruction": string,
      "questions": [
        {
          "questionText": string,
          "difficulty": "Easy" | "Moderate" | "Hard",
          "marks": number
        }
      ]
    }
  ]
}

Rules:
- Return JSON only. Do not include markdown fences, commentary, or a function call wrapper.
- Create one section per question type in the breakdown.
- Match each section's question count and marks exactly.
- Keep the total number of questions and total marks aligned with the specification.
- For multiple choice questions, include an options array with exactly four plausible choices.
- For all other question types, omit the options field.

Topic/Title: ${title}
Total Marks: ${totalMarks}
Total Questions: ${numberOfQuestions}

Question Breakdown:
- ${configString}

Additional Instructions from Teacher: 
${instructions || "Follow standard academic guidelines."}

Ensure the total marks and question counts match the breakdown exactly. Distribute the difficulty levels (Easy, Moderate, Hard) logically across the questions.`;

  try {
    console.log(`Generating AI paper for: ${title}...`);

    const result = await llm.invoke(prompt);
    const content = typeof result.content === "string" ? result.content : JSON.stringify(result.content);
    const parsed = JSON.parse(extractJson(content));

    return PaperSchema.parse(parsed);

  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate structured AI response");
  }
};