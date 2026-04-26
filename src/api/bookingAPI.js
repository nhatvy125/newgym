import axiosClient from "./axiosClient";

const bookingApi = {
  getAll: (params) => {
    return axiosClient.get('/bookings', { params });
  },
  getById: (id) => {
    return axiosClient.get(`/bookings/${id}`);
  },
  create: (data) => {
    return axiosClient.post('/bookings', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/bookings/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/bookings/${id}`);
  }
};

export default bookingApi;