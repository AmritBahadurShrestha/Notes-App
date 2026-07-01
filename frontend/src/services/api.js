import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

export const getNotes = () => api.get("/api/notes").then((res) => res.data);

export const createNote = (note) => api.post("/api/notes", note).then((res) => res.data);

export const updateNote = (id, note) =>
  api.put(`/api/notes/${id}`, note).then((res) => res.data);

export const deleteNote = (id) => api.delete(`/api/notes/${id}`);

export default api;
