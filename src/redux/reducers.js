/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from 'redux';
import EmployeeSlice from './employee/EmployeeSlice';
import ProjectSlice from './project/ProjectSlice';
import LmsSlice from './lms/LmsSlice';
import HmsSlice from './hms/HmsSlice';
import RequestSlice from './request/RequestSlice';
import userInfoSlice from './sign-in/userInfoSlice';
import SidebarSlice from './sidebar/SidebarSlice';
import ReportingSlice from './reporting/ReportingSlice';
import subAdminSlice from './sub-admin/subAdminSlice';

export const rootReducer = combineReducers({
  subAdmin: subAdminSlice,
  userInfo: userInfoSlice,
  sidebar: SidebarSlice,
  employeeSlice: EmployeeSlice,
  projectSlice: ProjectSlice,
  reportingSlice: ReportingSlice,
  LmsSlice: LmsSlice,
  HmsSlice: HmsSlice,
  RequestSlice: RequestSlice
});
