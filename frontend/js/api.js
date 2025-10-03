const API = "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  options.headers = options.headers || {};
  if (token) options.headers["Authorization"] = "Bearer " + token;
  return fetch(API + path, options).then(res => res.json());
}
