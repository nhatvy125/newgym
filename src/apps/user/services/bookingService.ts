// src/services/bookingService.ts
// Sửa endpoint: POST /api/classes/{classId}/book (khớp BE)

import axios from "axios";
import { BASE_URL } from "@/api/api";

const API = BASE_URL;

export interface BookingResponse {
  id: number;
  classId: number;
  className: string;
  trainerName: string;
  date: string;        // yyyy-MM-dd
  startTime: string;   // HH:mm:ss
  endTime: string;
  studio?: string;
  status?: string;     // BOOKED | COMPLETED | CANCELLED
  createdAt?: string;
}

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const bookingService = {
  /** POST /api/classes/{classId}/book */
  async create(classId: number): Promise<BookingResponse> {
    const res = await axios.post<BookingResponse>(
      `${API}/classes/${classId}/book`,
      null,
      { headers: authHeader() }
    );
    return res.data;
  },

  /** GET /api/classes/my-bookings */
  async getMyBookings(): Promise<BookingResponse[]> {
    const res = await axios.get<BookingResponse[]>(
      `${API}/classes/my-bookings`,
      { headers: authHeader() }
    );
    return res.data || [];
  },

  /** DELETE /api/classes/bookings/{id} */
  async cancel(bookingId: number): Promise<void> {
    await axios.delete(`${API}/classes/bookings/${bookingId}`, { headers: authHeader() });
  },
};
