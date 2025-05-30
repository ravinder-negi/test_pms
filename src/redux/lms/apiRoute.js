import { deleteApi, getApi, postApi, putApi } from '../../services/api_methods';

// Done
export const ApplyLeaveApi = (payload) => {
  return postApi(`/lms/apply-leave`, payload);
};
//Done
export const UpdateLeaveStatusApi = (payload) => {
  return putApi(`/lms/update-leave-status`, payload);
};

//Done
export const GetLmsLogsApi = (payload) => {
  return getApi(`/lms/get-lms-logs?${payload}`);
};

// Done
export const GetLeavesListingApi = (query) => {
  return getApi(`/lms/get-leaves-listing?${query}`);
};

//Done
export const GetLeavesOverviewApi = (payload) => {
  const url = `/lms/get-leave-overview?type=${payload?.type}&startDate=${payload?.start_date}&endDate=${payload?.end_date}`;
  const urlId = `/lms/get-leave-overview?type=${payload?.type}&startDate=${payload?.start_date}&endDate=${payload?.end_date}&employeeId=${payload?.id}`;
  return getApi(payload?.id ? urlId : url, payload);
};

// Done
export const GetEmployeeLeavesApi = (query, id) => {
  return getApi(`/lms/get-employee-leaves/${id}?${query}`);
};

export const GetLeaveStatusApi = (payload) => {
  return getApi(`/lms/leave-stats/${payload?.id}?filter=${payload?.filter}`);
};

//Done
export const GetLeaveApi = (payload) => {
  return getApi(`/lms/getLeaveById/?leave_id=${payload?.leave_id}`, payload);
};

//Done
export const DeleteLeaveApi = (payload) => {
  return deleteApi(`/lms/delete-leave/`, payload);
};

export const GetReportingDetails = (id) => {
  return getApi(`/project/getProjectInchargesByEmployee/${id}`);
};

export const GetLeaveRequests = (payload) => {
  return getApi(`/lms/leaves-for-approval?${payload}`);
};
