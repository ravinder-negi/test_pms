import { deleteApi, getApi, postApi, putApi } from '../../services/api_methods';

export const GetProjectSources = (params) => {
  return getApi(`/psid/get-project-sources?${params}`);
};

export const AddProjectSource = (payload) => {
  return postApi(`/psid/add-project-source-ids`, payload);
};

export const UpdateProjectSource = (id, payload) => {
  return putApi(`/psid/update-project-source/${id}`, payload);
};

export const DeleteProjectSource = (id) => {
  return deleteApi(`/psid/delete-project-source/${id}`);
};

export const GetBillingIdCount = () => {
  return getApi(`/psid/billing-id-counts`);
};

export const GetBillingLogs = (params) => {
  return getApi(`/psid/get-psid-logs-by-id?${params}`);
};
