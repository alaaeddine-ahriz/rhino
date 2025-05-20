export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface MatieresResponse {
  matieres: string[];
}

export interface UpdateResponse {
  matiere: string;
  updated: boolean;
  documents_processed: number;
  index_size: number;
}

export interface Source {
  document: number;
  source: string;
  section: string;
  contenu: string;
  relevance_score: number;
}

export interface QuestionResponse {
  response: string;
  sources: Source[];
  matiere: string;
  query: string;
  processing_time: number;
  tokens_used: number;
}

export interface ReflectionQuestion {
  question: string;
  concepts_abordés: string[];
  niveau_difficulté: string;
  compétences_visées: string[];
  éléments_réponse: string[];
}

export interface ReflectionMetadata {
  difficulty_level: number;
  estimated_time: string;
  prerequisites: string[];
}

export interface ReflectionResponse {
  question: ReflectionQuestion;
  matiere: string;
  concept: string;
  format: string;
  metadata: ReflectionMetadata;
}

export interface ApiError {
  code: string;
  details: string;
  field?: string;
  type: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: ApiError;
  timestamp: string;
} 