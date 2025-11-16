import { create } from 'zustand';

interface GameStore {
  selectedPersonId: string | null;
  activeTab: 'suspects' | 'timeline' | 'evidence' | 'interview';
  interviewingPersonId: string | null;
  setSelectedPerson: (id: string | null) => void;
  setActiveTab: (tab: 'suspects' | 'timeline' | 'evidence' | 'interview') => void;
  setInterviewingPerson: (id: string | null) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  selectedPersonId: null,
  activeTab: 'suspects',
  interviewingPersonId: null,
  setSelectedPerson: (id) => set({ selectedPersonId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setInterviewingPerson: (id) => set({ interviewingPersonId: id }),
}));
