import axiosClient from "./axiosClient";

const memberApi = {
  getAll: (params) => {
    return axiosClient.get('/users', { params });
  },
  getById: (id) => {
    return axiosClient.get(`/users/${id}`);
  },
  getMe: () => {
    return axiosClient.get('/users/me');
  },
  create: (data) => {
    return axiosClient.post('/users/register', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/users/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/users/${id}`);
  }
};

export default memberApi;