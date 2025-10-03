import { apiFetch } from "./api.js";

export async function applyToJob(jobId, resumeFile) {
  const formData = new FormData();
  formData.append("jobId", jobId);
  formData.append("resume", resumeFile);
  const token = localStorage.getItem("token");
  return fetch("http://localhost:5000/applications/apply", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: formData,
  }).then(res => res.json());
}