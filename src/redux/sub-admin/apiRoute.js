import { deleteApi, getApi, postApi, putApi } from '../../services/api_methods';

export const CreateAdminApi = (payload) => {
  return postApi(`/sub-admin/add-sub-admin`, payload);
};

export const EditAdminApi = (id, payload) => {
  return putApi(`/sub-admin/edit-sub-admin/${id}`, payload);
};

export const GetAdminListing = (params) => {
  return getApi(`/sub-admin/sub-admins?${params}`);
};

export const DeleteAdminApi = (id) => {
  return deleteApi(`/sub-admin/sub-admins/${id}`);
};

export const GetAdminLogs = (params) => {
  return getApi(`/sub-admin/get-sub-admin-logs?${params}`);
};
