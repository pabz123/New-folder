import { apiFetch } from "./api.js";

export async function login(email, password) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (res.token) localStorage.setItem("token", res.token);
  return res;
}

export async function register(email, password, role) {
  return apiFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
}

export function logout() {
  localStorage.removeItem("token");
}