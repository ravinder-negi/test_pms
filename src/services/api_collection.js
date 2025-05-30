import { deleteApi, getApi, patchApi, postApi, putApi } from './api_methods';

const ClientAdd = '/client/add-client';
const ClientShow = '/admin/get-allclients';
const ClientUPdate = '/client/update-client/';
const UpdatePassword = 'employee/update-employee-password?id=';
const SubAdminPassword = 'admin/update-admin-password?id=';
const ForgetPassword = 'employee/forgot-password';
const ADD_EMPLOYEE_ADDRESS = 'employee/add-employee-address';
const ADD_EMPLOYEE_BANK = 'employee/add-or-update-employee-bank';
const UPDATE_EMPLOYEE_ADDRESS = 'employee/update-employee-address';
const HMS_ADD_DEVICE = 'hms/add-device';
const GET_DEVICE_LISTING = 'hms/devices-listing';
const DELETE_DEVICE = 'hms/delete-device';
const EDIT_DEVICE = 'hms/edit-device';
const ASSIGN_DEVICE = 'hms/assign-device';
const GET_DEVICE_DETAILS = 'hms/device-details';
const CHANGE_DEVICE_STATUS = 'hms/change-device-status';
const GET_ALL_EMPLOYEES = 'project/get-all-employees';
const GET_ASSIGN_DEVICE_LISTING = 'hms/devices-assignees-listing';
const RETURN_DEVICE = 'hms/return-device';
const ADD_DEVICE_REMARK = 'hms/add-remarks';
const GET_DEVICE_REMARK = 'hms/get-remarks';
const DELETE_DEVICE_REMARK = 'hms/delete-remarks';
const UPDATE_DEVICE_REMARKS = 'hms/update-remarks';
const GET_DEVICE_ASSIGN_DETAILS = 'hms/get-devices-assignees-detail';
const GET_DEVICE_COUNTS = 'hms/devices-counts';
const GET_ASSIGN_HISTORY = 'hms/assignees-history';
const GET_HMS_LOGS = '/hms/get-hms-logs-by-id';
const CreateReport = '/reporting/create-reporting';
const GET_REPORT = '/reporting/getAllReportings';
const DELETE_REPORT = '/reporting/delete-reporting';
const UPDATE_REPORT = '/reporting/update-reporting';

// Password Change APIs
export const updatePasswordApi = (id, payload) => putApi(UpdatePassword + id, payload);
export const subAdminPasswordApi = (id, payload) => putApi(SubAdminPassword + id, payload);
export const ForgetPasswordApi = (payload) => putApi(ForgetPassword, payload);

// Employee APIS
export const addEmployeeAddress = (payload) => postApi(ADD_EMPLOYEE_ADDRESS, payload);
export const addEmployeeBank = (payload, id) => postApi(`${ADD_EMPLOYEE_BANK}/${id}`, payload);
export const updateEmployeeAddress = (payload) => putApi(UPDATE_EMPLOYEE_ADDRESS, payload);

// HMS APIS
export const hmsAddDevice = (payload) => postApi(HMS_ADD_DEVICE, payload);
export const getDeviceListing = (payload) => getApi(`${GET_DEVICE_LISTING}?${payload}`);
export const deleteDevice = (id) => deleteApi(`${DELETE_DEVICE}?id=${id}`);
export const editDevice = (payload, id) => patchApi(`${EDIT_DEVICE}?id=${id}`, payload);
export const getDeviceDetails = (id) => getApi(`${GET_DEVICE_DETAILS}?id=${id}`);
export const changeDeviceStatus = (payload) => putApi(CHANGE_DEVICE_STATUS, payload);
export const getAllEmployees = () => getApi(GET_ALL_EMPLOYEES);
export const getAssignHistory = (payload) => getApi(`${GET_ASSIGN_HISTORY}?${payload}`);
export const addDeviceRemark = (id, payload) => postApi(`${ADD_DEVICE_REMARK}/${id}`, payload);
export const getDeviceRemark = (id) => getApi(`${GET_DEVICE_REMARK}/${id}`);
export const deleteDeviceRemark = (id) => deleteApi(`${DELETE_DEVICE_REMARK}/${id}`);
export const getDeviceAssignDetails = (id) => getApi(`${GET_DEVICE_ASSIGN_DETAILS}?id=${id}`);
export const getDeviceCounts = () => getApi(GET_DEVICE_COUNTS);
export const getHmsLogs = (payload) => getApi(`${GET_HMS_LOGS}?${payload}`);
export const updateDeviceRemarks = (id, payload) =>
  putApi(`${UPDATE_DEVICE_REMARKS}/${id}`, payload);
export const assignDevice = (emp_id, deviceId) =>
  postApi(`${ASSIGN_DEVICE}?deviceId=${deviceId}&emp_id=${emp_id}`);
export const getAssignDeviceListing = (payload) =>
  getApi(`${GET_ASSIGN_DEVICE_LISTING}?${payload}`);
export const returnDevice = (deviceId, emp_id) =>
  postApi(`${RETURN_DEVICE}?deviceId=${deviceId}&emp_id=${emp_id}`);

// Client APIs
export const clientAddApi = (payload) => postApi(ClientAdd, payload);
export const getAllClients = (query) => getApi(`/client/get-clients?${query}`);
export const getClientLogs = (query) => getApi(`/client/get-client-logs?${query}`);
export const clientShowApi = (payload) => getApi(ClientShow, payload);
export const clientUpdateApi = (payload) => putApi(ClientUPdate, payload);
export const deleteClientApi = (id) => deleteApi(`/client/delete-client/${id}`);
export const getClientCountsApi = () => getApi(`/client/get-client-counts`);

// Reporting
export const createReportApi = (payload) => postApi(CreateReport, payload);
export const getAllReports = (query) => getApi(`${GET_REPORT}?${query}`);
export const deleteReportApi = (id) => deleteApi(`${DELETE_REPORT}/${id}`);
export const updateReportApi = (payload) => putApi(`${UPDATE_REPORT}`, payload);
