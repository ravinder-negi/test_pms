import { deleteApi, getApi, postApi, putApi } from '../../services/api_methods';

export const createProjectApi = (data) => postApi(`/project/create-project`, data);

export const getClientOptionsApi = () => getApi(`/project/get-all-clients`);

export const getEmployeeOptionsApi = () => getApi(`/project/get-all-employees`);

export const getProjectsList = (query) => getApi(`/project/get-projects-listing?${query}`);

export const updateProjectApi = (data) => putApi(`/project/update-project`, data);

export const deleteProjectApi = (id) => deleteApi(`/project/delete-project/${id}`);

export const getProjectsLogs = (query) => getApi(`/project/get-project-logs/?${query}`);

export const getProjectGraphApi = (query) => getApi(`/project/get-project-status-counts?${query}`);

export const getProjectDetails = (id) => getApi(`/project/get-project-client-details/${id}`);

export const getProjectDocumentApi = (id) => getApi(`/project/get-all-project-documents/${id}`);

export const deleteProjectDocumentApi = (id) => deleteApi(`/project/delete-project-document/${id}`);

export const addChangeRequestApi = (data) => postApi(`/project/add-change-request-module`, data);

export const getChangeRequestsApi = (id) => getApi(`/project/get-change-request-modules/${id}`);

export const deleteChangeRequestApi = (id) =>
  deleteApi(`/project/delete-change-request-module/${id}`);

export const updateChangeRequestApi = (data, id) =>
  putApi(`/project/update-change-request-module/${id}`, data);

export const getMilestoneList = (id, params) =>
  getApi(`/project/get-project-milestones/${id}?${params}`);

export const deleteMilestoneApi = (id) => deleteApi(`/project/delete-project-milestone/${id}`);

export const addMilestoneApi = (data) => postApi(`/project/add-project-milestone`, data);

export const updateMilestoneApi = (data, id) =>
  putApi(`/project/update-project-milestone/${id}`, data);

export const updateProjectInchargeApi = (data, id) =>
  putApi(`/project/update-project-incharge/${id}`, data);

export const updateProjectTeamApi = (data, id) =>
  putApi(`/project/update-team-members/${id}`, data);

export const getAllMembersProject = (id) => getApi(`/project/getAllMemberOfProject/${id}`);

export const getProjectOptionsApi = (query) => getApi(`/project/getAllProjects?${query}`);

export const updateProjectManagerApi = (data, id) =>
  putApi(`/project/update-project-manager/${id}`, data);

export const getProjectSourcesApi = (query) => getApi(`/psid/get-project-sources?${query}`);
