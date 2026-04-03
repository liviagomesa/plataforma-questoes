export type QuestionType = 'MULTIPLE_CHOICE' | 'MULTIPLE_CORRECT' | 'DISCURSIVE' | 'SORTING' | 'MATCHING' | 'TABLE';

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  data: MultipleChoiceData | MultipleCorrectData | DiscursiveData | SortingData | MatchingData | TableData;
  createdAt: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface MultipleChoiceData {
  options: Option[];
  correctId: string;
}

export interface MultipleCorrectData {
  options: Option[];
  correctIds: string[];
}

export interface DiscursiveData {
  expectedAnswer: string;
}

export interface SortingItem {
  id: string;
  text: string;
  order: number;
}

export interface SortingData {
  items: SortingItem[];
}

export interface MatchingPair {
  id: string;
  term: string;
  definition: string;
}

export interface MatchingData {
  pairs: MatchingPair[];
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export const TYPE_LABELS: Record<QuestionType, string> = {
  MULTIPLE_CHOICE: 'Múltipla Escolha',
  MULTIPLE_CORRECT: 'Múltipla Correta',
  DISCURSIVE: 'Discursiva',
  SORTING: 'Ordenação',
  MATCHING: 'Associação',
  TABLE: 'Tabela'
};
