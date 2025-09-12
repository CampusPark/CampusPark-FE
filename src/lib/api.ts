// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://api.example.com",
  headers: { "Content-Type": "application/json" },
  // 필요시 withCredentials: true,
});
