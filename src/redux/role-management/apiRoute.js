import { deleteApi, getApi, postApi, putApi } from '../../services/api_methods';

const BASE_URL = '/role';

export const getAllRolesAPI = () => getApi(`${BASE_URL}/get-roles`);

export const createRoleAPI = (payload) => postApi(`${BASE_URL}/create-role`, payload);

export const deleteRoleApi = (query) => deleteApi(`${BASE_URL}/delete-role?${query}`);

export const getRolePermissionsAPI = (query) => getApi(`${BASE_URL}/get-role-permissions?${query}`);

export const updateRoleAPI = (payload) => putApi(`${BASE_URL}/update-role`, payload);

export const getRoleLogsAPI = (query) => getApi(`${BASE_URL}/get-role-logs?${query}`);
