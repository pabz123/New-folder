import { auth } from './auth.js';

class API {
  constructor() {
    this.baseURL = 'http://localhost:5000'; // Remove /api
  }

  async fetch(endpoint, options = {}) {
    const token = auth.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Jobs API
  async getJobs(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.fetch(`/jobs?${queryString}`);
  }

  async getJob(id) {
    return this.fetch(`/jobs/${id}`);
  }

  async createJob(jobData) {
    return this.fetch('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }

  // Applications API
  async applyToJob(jobId, formData) {
    const token = auth.getToken();
    
    return fetch(`${this.baseURL}/applications/apply`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }).then(res => res.json());
  }

  async getMyApplications() {
    return this.fetch('/applications/my');
  }

  // Profile API
  async updateProfile(profileData) {
    return this.fetch('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const token = auth.getToken();
    
    return fetch(`${this.baseURL}/profile/resume`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }).then(res => res.json());
  }
}

export const api = new API();