import { api } from './api.js';

class JobManager {
  constructor() {
    this.currentFilters = {
      type: '',
      location: '',
      industry: ''
    };
  }

  async loadJobs(filters = {}) {
    try {
      const jobs = await api.getJobs(filters);
      this.renderJobs(jobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      this.showError('Failed to load jobs');
    }
  }

  renderJobs(jobs) {
    const container = document.getElementById('jobsList');
    if (!container) return;

    container.innerHTML = jobs.map(job => `
      <div class="job-card">
        <div class="job-header">
          <h3>${job.title}</h3>
          <span class="company-name">${job.company}</span>
        </div>
        <div class="job-body">
          <p>${job.description}</p>
          <div class="job-tags">
            <span class="tag">${job.type}</span>
            <span class="tag">${job.location}</span>
            <span class="tag">${job.industry}</span>
          </div>
        </div>
        <div class="job-footer">
          <button class="btn btn-primary" onclick="viewJob(${job.id})">View Details</button>
          <span class="posted-date">Posted ${this.formatDate(job.createdAt)}</span>
        </div>
      </div>
    `).join('');
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  applyFilters() {
    this.loadJobs(this.currentFilters);
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
  }
}

export const jobManager = new JobManager();