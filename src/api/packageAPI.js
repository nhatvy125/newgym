import axiosClient from "./axiosClient";

const packageApi = {
  getAll: (params) => {
    return axiosClient.get('/packages', { params });
  },
  getById: (id) => {
    return axiosClient.get(`/packages/${id}`);
  },
  create: (data) => {
    return axiosClient.post('/packages', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/packages/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/packages/${id}`);
  }
};

export default packageApi;