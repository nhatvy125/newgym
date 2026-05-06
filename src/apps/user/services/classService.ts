// src/services/classService.ts
// Service quản lý danh sách lớp học. Map đúng schema BE Spring Boot trả về.

import axios from "axios";
import { BASE_URL } from "@/api/api";

const API = BASE_URL;

// Schema raw từ BE
export interface GymClassResponse {
  id: number;
  name: string;
  schedule?: string;       // "Thứ 2 - 4 - 6"
  date: string;            // yyyy-MM-dd
  startTime: string;       // HH:mm:ss
  endTime: string;         // HH:mm:ss
  studio?: string;
  maxCapacity: number;
  currentCapacity: number;
  spotsLeft: number;
  trainerName: string;
  status?: string;
  createdAt?: string;
}

// Type "view-friendly" (giữ tương thích code cũ)
export interface GymClass extends GymClassResponse {
  /** alias trainerName */
  trainer: string;
  /** "HH:mm - HH:mm" */
  time: string;
  /** alias spotsLeft */
  slots: number;
}

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function adapt(c: GymClassResponse): GymClass {
  const s = (c.startTime || "").slice(0, 5);
  const e = (c.endTime || "").slice(0, 5);
  return {
    ...c,
    trainer: c.trainerName,
    time: s && e ? `${s} - ${e}` : "",
    slots: c.spotsLeft,
  };
}

export const classService = {
  async getAll(): Promise<GymClass[]> {
    const res = await axios.get<GymClassResponse[]>(`${API}/classes`, { headers: authHeader() });
    return (res.data || []).map(adapt);
  },
};
