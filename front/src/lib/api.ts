import { ApiResponse, MatieresResponse, QuestionResponse, ReflectionResponse, UpdateResponse } from '@/types/api';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getMatieres() {
  return fetchApi<MatieresResponse>('/matieres', {
    method: 'GET',
  });
}

export async function updateMatiere(matiere: string) {
  return fetchApi<UpdateResponse>('/matieres/update', {
    method: 'POST',
    body: JSON.stringify({ matiere }),
  });
}

export async function askQuestion(matiere: string, query: string) {
  return fetchApi<QuestionResponse>('/question', {
    method: 'POST',
    body: JSON.stringify({ matiere, query }),
  });
}

export interface ReflectionQuestion {
  question: string;
  concepts_abordés: string[];
  niveau_difficulté: string;
  compétences_visées: string[];
  éléments_réponse: string[];
}

export interface EvaluationData {
  note: number;
  points_forts: string[];
  points_ameliorer: string[];
  reponse_modele: string;
  justification_note: string;
  conseil_personnalise: string;
}

export interface EvaluationResponse {
  evaluation: EvaluationData;
  matiere: string;
  logs: string;
}

export const generateReflectionQuestion = async (matiere: string, conceptCle: string) => {
  return fetchApi<ReflectionQuestion>('/question/reflection', {
    method: 'POST',
    body: JSON.stringify({ matiere, concept_cle: conceptCle }),
  });
};

export const evaluateResponse = async (matiere: string, question: string, response: string): Promise<ApiResponse<EvaluationResponse>> => {
  return fetchApi<EvaluationResponse>('/evaluation/response', {
    method: 'POST',
    body: JSON.stringify({
      matiere,
      question,
      student_response: response,
    }),
  });
}; 