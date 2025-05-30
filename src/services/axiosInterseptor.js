import axios from 'axios';
import { store } from '../redux/store';

const base_url = process.env.REACT_APP_API_BASEURL;

const axiosInterceptor = axios.create({
  timeout: 10000,
  baseURL: base_url
});

axiosInterceptor.interceptors.request.use(
  (config) => {
    const token = store.getState()?.userInfo?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Accept'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInterceptor.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error?.response?.data);
  }
);

export default axiosInterceptor;
