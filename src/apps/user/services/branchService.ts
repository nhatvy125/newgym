import { api } from "@/api/api";

export interface BranchResponse {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: string;
}

export const branchService = {
  list: async (): Promise<BranchResponse[]> => {
    return api.get<BranchResponse[]>("/branches");
  },
  getById: async (id: number): Promise<BranchResponse> => {
    return api.get<BranchResponse>(`/branches/${id}`);
  },
  create: async (data: Omit<BranchResponse, "id">): Promise<BranchResponse> => {
    return api.post<BranchResponse>("/branches", data);
  },
  update: async (id: number, data: Partial<BranchResponse>): Promise<BranchResponse> => {
    return api.put<BranchResponse>(`/branches/${id}`, data);
  },
  delete: async (id: number): Promise<void> => {
    return api.del<void>(`/branches/${id}`);
  },
};