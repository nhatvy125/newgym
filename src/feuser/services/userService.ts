import { api } from "@/api/api";

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  gymPackage?: string;
  expiryDate?: string;
}

export const userService = {
  list: async (page = 0, size = 50, search = ""): Promise<any> => {
    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("size", String(size));
    if (search) query.set("search", search);
    return api.get<any>(`/users?${query.toString()}`);
  },
  getById: async (id: number): Promise<UserResponse> => {
    return api.get<UserResponse>(`/users/${id}`);
  },
  create: async (data: { username: string; password: string; email: string; fullName: string; role: string }): Promise<UserResponse> => {
    return api.post<UserResponse>("/users/register", data);
  },
  update: async (id: number, data: Partial<UserResponse>): Promise<UserResponse> => {
    return api.put<UserResponse>(`/users/${id}`, data);
  },
  delete: async (id: number): Promise<void> => {
    return api.del<void>(`/users/${id}`);
  },
};
