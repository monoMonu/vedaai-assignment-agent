import { create } from 'zustand';
import { IAssignment, IPaper } from '../types';

interface AssignmentState {
  currentAssignment: Partial<IAssignment>;
  setAssignmentField: <K extends keyof IAssignment>(field: K, value: IAssignment[K]) => void;

  activeAssignmentId: string | null;
  activeAssignmentTitle: string;
  activePaperId: string | null;
  setActiveAssignment: (payload: { id: string; title: string }) => void;
  setActivePaperId: (paperId: string | null) => void;
  clearActiveAssignment: () => void;

  generationStatus: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
  setGenerationStatus: (status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed') => void;
  
  generatedPaper: IPaper | null;
  setGeneratedPaper: (paper: IPaper) => void;

  resetStore: () => void;
}

const getInitialState = () => ({
  currentAssignment: {
    title: '',
    instructions: '',
    totalMarks: 0,
    questionConfigs: [],
    timeAllowed: '',
    numberOfQuestions: 0,
    dueDate: '',
    createdAt: ''
  },
  activeAssignmentId: null,
  activeAssignmentTitle: '',
  activePaperId: null,
  generationStatus: 'idle' as const,
  generatedPaper: null,
});

export const useAssignmentStore = create<AssignmentState>((set) => ({
  ...getInitialState(),

  setAssignmentField: (field, value) =>
    set((state) => ({
      currentAssignment: { ...state.currentAssignment, [field]: value },
    })),

  setActiveAssignment: ({ id, title }) =>
    set({ activeAssignmentId: id, activeAssignmentTitle: title }),

  setActivePaperId: (paperId) => set({ activePaperId: paperId }),

  clearActiveAssignment: () =>
    set({ activeAssignmentId: null, activeAssignmentTitle: '', activePaperId: null, generationStatus: 'idle' }),

  setGenerationStatus: (status) => set({ generationStatus: status }),

  setGeneratedPaper: (paper) => set({ generatedPaper: paper }),

  resetStore: () => set(getInitialState()),
}));