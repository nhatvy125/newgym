import axiosClient from './axiosClient';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const extractData = <T>(response: { data: T }) => response.data;

export const api = {
  get: async <T>(url: string) => extractData(await axiosClient.get<T>(url)),
  post: async <T>(url: string, body?: unknown) => extractData(await axiosClient.post<T>(url, body)),
  put: async <T>(url: string, body?: unknown) => extractData(await axiosClient.put<T>(url, body)),
  delete: async <T>(url: string) => extractData(await axiosClient.delete<T>(url)),
  del: async <T>(url: string) => extractData(await axiosClient.delete<T>(url)),
  patch: async <T>(url: string, body?: unknown) => extractData(await axiosClient.patch<T>(url, body)),
};
