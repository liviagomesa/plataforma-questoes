export type QuestionType = 'MULTIPLE_CHOICE' | 'DISCURSIVE' | 'SORTING' | 'MATCHING' | 'TABLE';

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  data: MultipleChoiceData | DiscursiveData | SortingData | MatchingData | TableData;
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
  DISCURSIVE: 'Discursiva',
  SORTING: 'Ordenação',
  MATCHING: 'Associação',
  TABLE: 'Tabela'
};
