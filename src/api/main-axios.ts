import axios, { AxiosError, AxiosResponse } from "axios";

const mainAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_BINANCE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

mainAxios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

mainAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default mainAxios;
