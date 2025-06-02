/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from 'redux';
import EmployeeSlice from './employee/EmployeeSlice';
import ProjectSlice from './project/ProjectSlice';
import LmsSlice from './lms/LmsSlice';
import HmsSlice from './hms/HmsSlice';
import RequestSlice from './request/RequestSlice';
import userInfoSlice from './sign-in/userInfoSlice';
import SidebarSlice from './sidebar/SidebarSlice';
import subAdminSlice from './sub-admin/subAdminSlice';
import NotificationSlice from './notification/NotificationSlice';

export const rootReducer = combineReducers({
  subAdmin: subAdminSlice,
  userInfo: userInfoSlice,
  sidebar: SidebarSlice,
  employeeSlice: EmployeeSlice,
  projectSlice: ProjectSlice,
  LmsSlice: LmsSlice,
  HmsSlice: HmsSlice,
  RequestSlice: RequestSlice,
  NotificationSlice: NotificationSlice
});
