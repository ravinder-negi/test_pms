import { deleteApi, getApi, postApi, putApi } from '../../services/api_methods';

const BASE_URL = '/employee';

export const createEmployeeApi = (data) => postApi(`${BASE_URL}/add-employee`, data);

export const getEmployeeApi = (query) => getApi(`${BASE_URL}/get-employee?${query}`);

export const viewEmployeeApi = (id) => getApi(`${BASE_URL}/get-employee-details/${id}`);

export const deleteEmployeeApi = (id) => deleteApi(`${BASE_URL}/delete-employee/${id}`);

export const updateEmployeeApi = (data) => putApi(`${BASE_URL}/update-employee`, data);

// Employee Credential APIs
export const createEmployeeCredentialApi = (data, id) =>
  postApi(`${BASE_URL}/save-employee-credentials/${id}`, data);

export const getEmployeeCredentialApi = (id) =>
  getApi(`${BASE_URL}/get-employee-credentials/${id}`);

export const updateEmployeeCredentialApi = (data, id) =>
  putApi(`${BASE_URL}/update-employee-credentials/${id}`, data);

export const deleteEmployeeCredentialApi = (id) =>
  deleteApi(`${BASE_URL}/delete-employee-credentials/${id}`);

// Employee Work Experience APIs
export const updateWorkExperienceApi = (data, id) =>
  putApi(`${BASE_URL}/update-work-experience/${id}`, data);

export const deleteWorkExperienceApi = (id) =>
  deleteApi(`${BASE_URL}/delete-employee-work-experience/${id}`);

export const createWorkExperienceApi = (data, id) =>
  postApi(`${BASE_URL}/work-experience/${id}`, data);

export const getWorkExperienceApi = (id) => getApi(`${BASE_URL}/get-work-experience/${id}`);

// Employee Education APIs
export const employeeEducationApi = (data, id) =>
  postApi(`${BASE_URL}/save-employee-education/${id}`, data);

export const updateEmployeeEducationApi = (data, id) =>
  putApi(`${BASE_URL}/update-employee-education/${id}`, data);

export const deleteEmployeeEducationApi = (id) =>
  deleteApi(`${BASE_URL}/delete-employee-education/${id}`);

export const getEmployeeEducationApi = (id) => getApi(`${BASE_URL}/get-employee-education/${id}`);

// Employee Remarks APIs
export const addEmployeeRemarksApi = (id, data) => postApi(`${BASE_URL}/add-remarks/${id}`, data);

export const getEmployeeRemarksApi = (id) => getApi(`${BASE_URL}/get-employees-remarks/${id}`);

export const deleteEmployeeRemarksApi = (id) =>
  deleteApi(`${BASE_URL}/delete-employees-remarks/${id}`);

export const updateEmployeeRemarks = (data, id) =>
  putApi(`${BASE_URL}/update-employees-remarks/${id}`, data);

// Employee Salary APIs
export const addEmployeeSalaryApi = (id, data) =>
  postApi(`${BASE_URL}/add-employee-salary/${id}`, data);

export const getEmployeeSalaryApi = (id) => getApi(`${BASE_URL}/get-employee-salary-details/${id}`);

export const updateEmployeeSalaryApi = (id, data) =>
  putApi(`${BASE_URL}/update-employee-salary/${id}`, data);

export const createReportApi = (data) => postApi(`${BASE_URL}/create-reports`, data);

export const getEmployeeRolesApi = () => getApi('/role/get-employee-roles');

export const getEmployeeLogsAPI = (query) => getApi(`${BASE_URL}/get-employee-logs?${query}`);

export const getEmployeeBankInfo = (id) => getApi(`${BASE_URL}/get-employee-bank-details/${id}`);

export const getDepartmentApi = () => getApi(`${BASE_URL}/get-all-departments`);

export const getDesignationsApi = (id) => getApi(`${BASE_URL}/get-all-designations/${id}`);

export const getAllDesignationsApi = () => getApi(`${BASE_URL}/get-all-designations-list`);

export const getTechnologiesApi = () => getApi(`${BASE_URL}/get-all-technologies`);

export const updatePasswordbyAdmin = (data) => putApi(`${BASE_URL}/update-password-by-admin`, data);

// Document Section APIs
const apiMiddlePath = {
  hms: 'device',
  employee: 'employee',
  project: 'project'
};

export const getEmployeeDocumentApi = (apiPath, param) => {
  return getApi(`/${apiPath}/get-${apiMiddlePath[apiPath]}-documents?${param}`);
};

export const deleteEmployeeeDocumentApi = (apiPath, id) => {
  return deleteApi(`/${apiPath}/delete-${apiMiddlePath[apiPath]}-documents/?${id}`);
};

export const addEmployeeDocumentApi = (apiPath, id, data) => {
  return postApi(`/${apiPath}/upload-${apiMiddlePath[apiPath]}-documents?${id}`, data);
};

export const createCollectionApi = (apiPath, payload) => {
  return postApi(`/${apiPath}/create-collection`, payload);
};

export const getCollectionApi = (apiType, param) => {
  return getApi(`/${apiType}/getAllCollection?${param}`);
};

export const editCollectionApi = (param, payload, apiPath) => {
  return putApi(`/${apiPath}/update-collection?id=${param}`, payload);
};

export const deleteCollectionApi = (apiPath, id) => {
  return deleteApi(`/${apiPath}/deleteCollection/?id=${id}`);
};

export const AddDocInCollection = (apiPath, payload) => {
  return postApi(`/${apiPath}/addDocumentInCollection`, payload);
};

export const removeDocInCollectionApi = (apiPath, payload) => {
  return postApi(`/${apiPath}/removeDocumentInCollection`, payload);
};
