import Dashboard from '../modules/dashboard/Dashboard';
import Projects from '../modules/projects/Projects';
import Reporting from '../modules/reporting/Reporting';
import Employee from '../modules/employees/Employees';
import Lms from '../modules/lms/LMS';
import Notification from '../modules/notification/Notification';
import RoleManagemet from '../modules/roles/RoleManagement';
import RoleDetails from '../modules/roles/RoleDetails';
import SubAdmin from '../modules/sub-admin/SubAdmin';
import AdminPasswordUpdate from '../modules/passwordUpdate/AdminPasswordUpdate';
import ProjectDetails from '../modules/projects/ProjectDetails';
import ViewEmployee from '../modules/employees/view-employee/ViewEmployee';
import ChangeRequest from '../components/projects/ChangeRequest';
import Milestone from '../components/projects/Milestone';
import LeaveDetail from '../modules/lms/LeaveDetail';
import ClientRoot from '../modules/client/ClientRoot';
import ClientInfo from '../modules/client/ClientInfo';
import MyProfile from '../modules/myProfile/MyProfile';
import Requests from '../modules/leaveRequest/Requests';
import RequestDetails from '../modules/leaveRequest/RequestDetails';
import EmployeeCollections from '../modules/employees/view-employee/components/EmployeeCollections';
import Hms from '../modules/hms/HMS';
import HmsDetails from '../modules/hms/details/HmsDetails';
import ViewReporting from '../modules/reporting/ViewReporting';
import BillingIds from '../modules/billingIds/BillingIds';

export const appRoutes = [
  { path: '/dashboard', Comp: <Dashboard />, routeName: 'dashboard', name: 'Dashboard' },
  { path: '/project', Comp: <Projects />, routeName: 'projects', name: 'Projects' },
  { path: '/reporting', Comp: <Reporting />, routeName: 'reporting', name: 'Reporting' },
  { path: '/employee', Comp: <Employee />, routeName: 'employee', name: 'Employees' },
  { path: '/lms', Comp: <Lms />, routeName: 'lms', name: 'Leave Management System' },
  {
    path: '/requests',
    Comp: <Requests />,
    routeName: 'requests',
    name: 'Leave Requests'
  },
  {
    path: '/requests/details/:id?',
    Comp: <RequestDetails />,
    routeName: 'requests'
  },
  {
    path: '/lms/details/:id?',
    Comp: <LeaveDetail />,
    routeName: 'lms'
  },
  {
    path: '/hms/details/:id?',
    Comp: <HmsDetails />,
    routeName: 'hms'
  },
  {
    path: '/notification',
    Comp: <Notification />,
    routeName: 'notifications',
    name: 'Notification'
  },
  { path: '/roles', Comp: <RoleManagemet />, routeName: 'roles', name: 'Role Management' },
  { path: '/clients', Comp: <ClientRoot />, routeName: 'clients', name: 'Clients' },
  { path: '/clients/info/:id?', Comp: <ClientInfo />, routeName: 'clients', name: 'Client' },
  {
    path: '/change-request',
    Comp: <ChangeRequest />,
    routeName: 'projects',
    name: 'Change Request'
  },
  {
    path: '/view-employee/:id?',
    Comp: <ViewEmployee />,
    routeName: 'employee',
    name: 'View Employee'
  },
  {
    path: '/view-employee/:id/collection/:collectionId?',
    Comp: <EmployeeCollections />,
    routeName: 'employee',
    name: 'View Employee'
  },
  { path: '/profile/:id?', Comp: <ViewEmployee />, routeName: 'employee', name: 'View Employee' },
  {
    path: '/view-report/:id?',
    Comp: <ViewReporting />,
    routeName: 'reporting',
    name: 'View Report'
  },
  {
    path: '/create-milestone',
    Comp: <Milestone />,
    routeName: 'projects',
    name: 'Create Milestone'
  },
  { path: '/roles/role/:id?', Comp: <RoleDetails />, routeName: 'roles' },
  { path: '/project/details/:id?', Comp: <ProjectDetails />, routeName: 'projects' },
  {
    path: '/project/details/:id/collection/:collectionId?',
    Comp: <EmployeeCollections />,
    routeName: 'projects',
    name: 'View projects'
  },
  {
    path: '/hms/details/:id/collection/:collectionId?',
    Comp: <EmployeeCollections />,
    routeName: 'projects',
    name: 'View projects'
  },
  { path: '/sub-admin', Comp: <SubAdmin />, routeName: 'subadmin', name: 'Sub Admin' },
  {
    path: '/update-admin-password',
    Comp: <AdminPasswordUpdate />,
    routeName: 'subadmin',
    name: 'Update Admin Password'
  },
  {
    path: 'my-profile/:id?',
    Comp: <MyProfile />,
    routeName: 'myprofile',
    name: 'My Profile'
  },
  {
    path: 'my-profile/:id/collection/:collectionId?',
    Comp: <EmployeeCollections />,
    routeName: 'myprofile',
    name: 'My Profile'
  },
  { path: '/hms', Comp: <Hms />, routeName: 'hms', name: 'Hardware Management System' },
  { path: '/billingIds', Comp: <BillingIds />, routeName: 'billing ids', name: 'Billing Ids' }
];
