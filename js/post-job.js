import { api } from './api.js';

export async function postJob(data) {
  return apiFetch('/jobs', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}