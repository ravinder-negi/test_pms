import { getApi, postApi } from '../../services/api_methods';

export const signInUrl = (data) => postApi(`/auth/login`, data);

export const dropDownUrl = () => getApi(`/admin/get-master-data`);
