import axiosClient from "./axiosClient";

const classApi = {
  getAll: (params) => {
    return axiosClient.get('/classes', { params });
  },
  getById: (id) => {
    return axiosClient.get(`/classes/${id}`);
  }
};
export default classApi;