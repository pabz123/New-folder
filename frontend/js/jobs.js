import { apiFetch } from "./api.js";

export async function fetchJobs() {
  return apiFetch("/jobs");
}

export async function fetchJob(id) {
  return apiFetch(`/jobs/${id}`);
}

export async function postJob(title, description) {
  return apiFetch("/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
}