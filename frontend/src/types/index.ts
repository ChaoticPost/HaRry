export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  experience: number;
  skills: string[];
  resumeUrl?: string;
  status: 'new' | 'interviewed' | 'hired' | 'rejected';
  createdAt: string;
  interviewId?: string;
  score?: number;
  matchPercentage?: number;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: string;
  completedAt?: string;
  duration?: number;
  transcript?: TranscriptEntry[];
  metrics?: InterviewMetrics;
  score?: number;
  notes?: string;
}

export interface TranscriptEntry {
  id: string;
  speaker: 'candidate' | 'interviewer';
  text: string;
  timestamp: number;
  confidence: number;
}

export interface InterviewMetrics {
  pausesSec: number;
  avgConfidence: number;
  speakingRate: number;
  sentimentScore: number;
  keywordsUsed: string[];
  technicalScore: number;
  communicationScore: number;
  overallScore: number;
}

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
  applicantsCount: number;
}

export interface Report {
  id: string;
  candidateId: string;
  interviewId: string;
  generatedAt: string;
  summary: string;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  finalScore: number;
  decision: 'hire' | 'reject' | 'maybe';
}

export interface CriteriaWeights {
  technical: number;
  communication: number;
  experience: number;
  culturalFit: number;
  motivation: number;
}

export interface WebSocketMessage {
  type: 'transcript' | 'metrics' | 'status';
  data: any;
  timestamp: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface NotificationData {
  candidateId: string;
  subject: string;
  body: string;
}
