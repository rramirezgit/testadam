// Tipos para Media AI API

export type MediaAiStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type MediaAiResolution = 'cuadrado' | 'retrato' | 'paisaje';

export type MediaAiType = 'IMAGE' | 'VIDEO' | 'GIF' | 'AUDIO';

export interface MediaAiMetadata {
  size: string;
  resolution: MediaAiResolution;
  model: string;
  quality: string;
  style: string;
  generatedAt: string;
}

export interface MediaAiGeneration {
  id: string;
  prompt: string;
  type: MediaAiType;
  status: MediaAiStatus;
  resultUrl?: string;
  error?: string | null;
  metadata?: MediaAiMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateImageRequest {
  prompt: string;
  type: MediaAiType;
  userId?: string;
  resolution?: MediaAiResolution;
}

export interface GenerateImageResponse {
  id: string;
  prompt: string;
  type: MediaAiType;
  status: MediaAiStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAiHistoryResponse {
  data: MediaAiGeneration[];
  total: number;
}

