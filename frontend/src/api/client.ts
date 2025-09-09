import type { Candidate } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      // Return mock data structure for graceful fallback
      return {
        data: null,
        success: false,
        message: 'API request failed'
      } as T;
    }
  }

  // Interviews
  async getInterviews(params?: any) {
    const queryParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/interviews${queryParams}`);
  }

  async getInterview(id: string) {
    return this.request(`/interviews/${id}`);
  }

  // Candidates
  async getCandidates(params?: any) {
    const queryParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/candidates${queryParams}`);
  }

  async getCandidate(id: string) {
    return this.request(`/candidates/${id}`);
  }

  async createCandidate(candidateData: FormData) {
    return this.request('/candidates', {
      method: 'POST',
      headers: {}, // Remove Content-Type for FormData
      body: candidateData,
    });
  }

  async updateCandidate(id: string, candidateData: Partial<Candidate>) {
    return this.request(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(candidateData),
    });
  }

  // Vacancies
  async getVacancies(params?: any) {
    const queryParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/vacancies${queryParams}`);
  }

  async createVacancy(vacancyData: any) {
    return this.request('/vacancies', {
      method: 'POST',
      body: JSON.stringify(vacancyData),
    });
  }

  // Reports
  async getReport(candidateId: string) {
    return this.request(`/reports/${candidateId}`);
  }

  async downloadReportPdf(candidateId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/reports/${candidateId}/pdf`);
    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }
    return response.blob();
  }

  // Notifications
  async sendNotification(notificationData: any) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  // WebSocket connection
  createWebSocket(interviewId: string): WebSocket {
    const wsUrl = `ws://localhost:8000/ws/interviews/${interviewId}`;
    return new WebSocket(wsUrl);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
