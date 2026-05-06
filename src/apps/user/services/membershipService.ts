import { api } from "@/api/api";

export interface InvoiceResponse {
  id: number;
  userId: number;
  username: string;
  packageId: number;
  packageName: string;
  price: number;
  paymentMethod: string;
  paymentDate: string;
  expiredDate: string;
  status: string;
  txnRef?: string;
  createdAt: string;
}

export const membershipService = {
  buy: async (packageId: number, paymentMethod = "CASH"): Promise<InvoiceResponse> => {
    return api.post<InvoiceResponse>("/membership/buy", { packageId, paymentMethod });
  },
  getMyMembership: async (): Promise<InvoiceResponse> => {
    return api.get<InvoiceResponse>("/membership/me");
  },
};
