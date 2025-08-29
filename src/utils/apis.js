import axios from "axios";
 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7295",
});

 api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth") || sessionStorage.getItem("auth");
  if (raw) {
    const { token } = JSON.parse(raw);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// utils/apis.js (or your api helper file)
export async function loginRequest(username, password) {
  try {
    const { data } = await api.post("/user/login", { username, password });
    return data;
  } catch (error) {
    const res = error.response;
    let errors = [];

    // Your API is returning an array like:
    // [{ error: "'Password' must not be empty.", propertyName: "password" }, ...]
    if (Array.isArray(res?.data)) {
      errors = res.data;
    }
    // Typical ASP.NET model-state shape
    else if (res?.data?.errors) {
      const e = res.data.errors;
      errors = Object.entries(e).flatMap(([key, arr]) =>
        arr.map((msg) => ({ propertyName: key, error: msg }))
      );
    } else if (typeof res?.data === "string") {
      errors = [{ propertyName: "_", error: res.data }];
    }

    // Keep a consistent error object
    throw { message: "Login failed", errors, status: res?.status };
  }
}

export async function registerRequest(payload) {
  try {
     const { data } = await api.post("/user", payload);
    return data;
  } catch (error) {
    const res = error.response;
    let errors = [];

     if (Array.isArray(res?.data)) {
      errors = res.data;
    }
     else if (res?.data?.errors) {
      const e = res.data.errors;
      errors = Object.entries(e).flatMap(([key, arr]) =>
        arr.map((msg) => ({ propertyName: key, error: msg }))
      );
    } else if (typeof res?.data === "string") {
      errors = [{ propertyName: "_", error: res.data }];
    }

    throw { message: "Registration failed", errors, status: res?.status };
  }
}
// --- keep your existing axios instance/export ---

export async function listProjects() {
  const { data } = await api.get("/projects");        // returns current user's projects
  return data;
}

export async function getProject(id) {
  const { data } = await api.get(`/projects/${id}`);
  return data;
}

export async function createProject(payload) {
  const { data } = await api.post("/projects", payload);
  return data;
}

export async function updateProject(id, payload) {
  const { data } = await api.put(`/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id) {
  await api.delete(`/projects/${id}`);
}
// --- Tasks ---
export async function listProjectTasks(projectId) {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data;
}
export async function getTask(projectId, taskId) {
  const { data } = await api.get(`/projects/${projectId}/tasks/${taskId}`);
  return data;
}
export async function createTask(projectId, payload) {
  const { data } = await api.post(`/projects/${projectId}/tasks`, payload);
  return data;
}
export async function updateTask(projectId, taskId, payload) {
  const { data } = await api.put(`/projects/${projectId}/tasks/${taskId}`, payload);
  return data;
}
export async function deleteTask(projectId, taskId) {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
}


export default api;
