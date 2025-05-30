import { deleteApi, getApi, postApi, putApi } from '../../services/api_methods';

export const AddNotificationApi = (payload) => {
  return postApi(`/notifications/create-notification`, payload);
};

export const GetNotificationApi = (params) => {
  return getApi(`/notifications/list-notifications?${params}`);
};

export const DeleteNotificationApi = (id) => {
  return deleteApi(`/notifications/delete-notifcation/${id}`, { id: id });
};

export const ReceivedNotificationApi = (id, params) => {
  return getApi(`/notifications/my-received-notifications/${id}?${params}`);
};

export const EditDraftNotification = (payload) => {
  return putApi(`/notifications/edit-draft-notification`, payload);
};
