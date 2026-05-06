import { api } from "@/api/api";

export interface PackageResponse {
  id: number;
  packageName: string;
  price: number;
  durationMonths: number;
  description: string;
}

export interface PackageRequest {
  packageName: string;
  price: number;
  durationMonths: number;
  description: string;
}

export const packageService = {
  getAll: async (): Promise<PackageResponse[]> => {
    return api.get<PackageResponse[]>("/packages");
  },
  getById: async (id: number): Promise<PackageResponse> => {
    return api.get<PackageResponse>(`/packages/${id}`);
  },
  create: async (data: PackageRequest): Promise<PackageResponse> => {
    return api.post<PackageResponse>("/packages", data);
  },
  update: async (id: number, data: PackageRequest): Promise<PackageResponse> => {
    return api.put<PackageResponse>(`/packages/${id}`, data);
  },
  delete: async (id: number): Promise<void> => {
    return api.del<void>(`/packages/${id}`);
  },
};
