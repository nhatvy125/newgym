import axiosClient from "./axiosClient";

const branchApi = {
  getAll: (params) => {
    return axiosClient.get('/branches', { params });
  },
  getById: (id) => {
    return axiosClient.get(`/branches/${id}`);
  },
  create: (data) => {
    return axiosClient.post('/branches', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/branches/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/branches/${id}`);
  }
};

export default branchApi;