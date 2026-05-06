import axiosClient from "./axiosClient";

const invoiceApi = {
  getAll: () => axiosClient.get('/membership/invoices'),
  getHistory: () => axiosClient.get('/membership/history'),
};

export default invoiceApi;
