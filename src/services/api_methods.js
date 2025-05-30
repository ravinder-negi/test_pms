import axios from './axiosInterseptor';

const request = async (method, url, data = {}) => {
  try {
    const config = method === 'get' || method === 'delete' ? { params: data } : data;
    const response = await axios[method](url, config);
    return response;
  } catch (error) {
    return error;
  }
};

export const postApi = (url, data) => request('post', url, data);
export const deleteApi = (url, data) => request('delete', url, data);
export const getApi = (url, data) => request('get', url, data);
export const putApi = (url, data) => request('put', url, data);
export const patchApi = (url, data) => request('patch', url, data);
