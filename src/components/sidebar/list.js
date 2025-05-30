import {
  ReportingIcon,
  EmployeesIcon,
  LmsIcon,
  HomeIcon,
  ProjectsIcon,
  SettingIcon
} from '../../theme/SvgIcons';

export const employee_menuItems = [
  {
    id: 1,
    name: 'Dashboard',
    icon: <HomeIcon />,
    path: '/dashboard',
    show: true
  },
  {
    id: 2,
    name: 'Projects',
    icon: <ProjectsIcon />,
    path: '/project',
    show: true
  },
  {
    id: 3,
    name: 'Reporting',
    icon: <ReportingIcon />,
    path: '/reporting',
    show: true
  },
  {
    id: 4,
    name: 'Profile',
    icon: <EmployeesIcon />,
    path: '/profile',
    show: true
  },
  {
    id: 5,
    name: 'LMS',
    icon: <LmsIcon />,
    path: '/lms',
    show: true
  },
  {
    id: 6,
    name: 'Attendance',
    icon: <SettingIcon />,
    path: '/view-attendance',
    show: true
  }
];
