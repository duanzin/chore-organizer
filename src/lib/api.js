const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(body.error || `Request failed: ${res.status}`);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  return res.json().catch(() => null);
}

export function fetchCategories() {
  return request("/categories");
}

export function createCategoryApi(category) {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify(category),
  });
}

export function fetchTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : "";
  return request(`/tasks${suffix}`);
}

export function createTaskApi(task) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function deleteTaskApi(taskId) {
  return request(`/tasks/${taskId}`, { method: "DELETE" });
}

export function addStepApi(taskId, data) {
  return request(`/tasks/${taskId}/steps`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateStepApi(taskId, stepId, data) {
  return request(`/tasks/${taskId}/steps/${stepId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteStepApi(taskId, stepId) {
  return request(`/tasks/${taskId}/steps/${stepId}`, {
    method: "DELETE",
  });
}
