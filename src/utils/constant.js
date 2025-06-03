import {
  AttendanceNewIcon,
  ClientIcon,
  EmployeesIcon,
  HMSIcon,
  HomeIcon,
  LmsIcon,
  NotificationIcon,
  ProjectNewIcon,
  ReportingIcon,
  RoleManagementIconNew,
  SubAdminNewIcon
} from '../theme/SvgIcons';

export const menuItems = [
  {
    id: 1,
    name: 'Dashboard',
    icon: <HomeIcon />,
    path: '/dashboard',
    routeName: 'dashboard'
  },
  {
    id: 2,
    name: 'Projects',
    icon: <ProjectNewIcon />,
    path: '/project',
    routeName: 'projects'
  },
  {
    id: 11,
    name: 'Clients',
    icon: <ClientIcon />,
    path: '/clients',
    routeName: 'clients'
  },
  {
    id: 4,
    name: 'Employees',
    icon: <EmployeesIcon />,
    path: '/employee',
    routeName: 'employee'
  },
  {
    id: 8,
    name: 'Sub-Admin',
    icon: <SubAdminNewIcon />,
    path: '/sub-admin',
    routeName: 'subadmin'
  },
  {
    id: 7,
    name: 'Role Management',
    icon: <RoleManagementIconNew />,
    path: '/roles',
    routeName: 'roles'
  },
  {
    id: 3,
    name: 'Reporting',
    icon: <ReportingIcon />,
    path: '/reporting',
    routeName: 'reporting'
  },
  {
    id: 5,
    name: 'LMS',
    icon: <LmsIcon />,
    path: '/lms',
    routeName: 'lms'
  },
  {
    id: 9,
    name: 'Attendance',
    icon: <AttendanceNewIcon />,
    path: '/view-attendance',
    routeName: 'attendance'
  },
  {
    id: 6,
    name: 'Notifications',
    icon: <NotificationIcon />,
    path: '/notification',
    routeName: 'notifications'
  },
  {
    id: 13,
    name: 'Leave Request',
    icon: <LmsIcon />,
    path: '/requests',
    routeName: 'requests'
  },
  {
    id: 15,
    name: 'Billing Ids',
    icon: <ReportingIcon />,
    path: '/billingIds',
    routeName: 'billing ids'
  },
  { id: 14, name: 'HMS', icon: <HMSIcon />, path: '/hms', routeName: 'hms' },
  {
    id: 10,
    name: 'My Profile',
    icon: <SubAdminNewIcon />,
    path: '/my-profile',
    routeName: 'myprofile'
  }
];

export const countriesOptions = [
  { id: 1, name: 'Aruba' },
  { id: 2, name: 'Afghanistan' },
  { id: 3, name: 'Angola' },
  { id: 4, name: 'Anguilla' },
  { id: 5, name: 'Åland Islands' },
  { id: 6, name: 'Albania' },
  { id: 7, name: 'Andorra' },
  { id: 8, name: 'United Arab Emirates' },
  { id: 9, name: 'Argentina' },
  { id: 10, name: 'Armenia' },
  { id: 11, name: 'American Samoa' },
  { id: 12, name: 'Antarctica' },
  { id: 13, name: 'French Southern Territories' },
  { id: 14, name: 'Antigua and Barbuda' },
  { id: 15, name: 'Australia' },
  { id: 16, name: 'Austria' },
  { id: 17, name: 'Azerbaijan' },
  { id: 18, name: 'Burundi' },
  { id: 19, name: 'Belgium' },
  { id: 20, name: 'Benin' },
  { id: 21, name: 'Bonaire, Sint Eustatius and Saba' },
  { id: 22, name: 'Burkina Faso' },
  { id: 23, name: 'Bangladesh' },
  { id: 24, name: 'Bulgaria' },
  { id: 25, name: 'Bahrain' },
  { id: 26, name: 'Bahamas' },
  { id: 27, name: 'Bosnia and Herzegovina' },
  { id: 28, name: 'Saint Barthélemy' },
  { id: 29, name: 'Belarus' },
  { id: 30, name: 'Belize' },
  { id: 31, name: 'Bermuda' },
  { id: 32, name: 'Bolivia, Plurinational State of' },
  { id: 33, name: 'Brazil' },
  { id: 34, name: 'Barbados' },
  { id: 35, name: 'Brunei Darussalam' },
  { id: 36, name: 'Bhutan' },
  { id: 37, name: 'Bouvet Island' },
  { id: 38, name: 'Botswana' },
  { id: 39, name: 'Central African Republic' },
  { id: 40, name: 'Canada' },
  { id: 41, name: 'Cocos (Keeling) Islands' },
  { id: 42, name: 'Switzerland' },
  { id: 43, name: 'Chile' },
  { id: 44, name: 'China' },
  { id: 45, name: "Côte d'Ivoire" },
  { id: 46, name: 'Cameroon' },
  { id: 47, name: 'Congo, The Democratic Republic of the' },
  { id: 48, name: 'Congo' },
  { id: 49, name: 'Cook Islands' },
  { id: 50, name: 'Colombia' },
  { id: 51, name: 'Comoros' },
  { id: 52, name: 'Cabo Verde' },
  { id: 53, name: 'Costa Rica' },
  { id: 54, name: 'Cuba' },
  { id: 55, name: 'Curaçao' },
  { id: 56, name: 'Christmas Island' },
  { id: 57, name: 'Cayman Islands' },
  { id: 58, name: 'Cyprus' },
  { id: 59, name: 'Czechia' },
  { id: 60, name: 'Germany' },
  { id: 61, name: 'Djibouti' },
  { id: 62, name: 'Dominica' },
  { id: 63, name: 'Denmark' },
  { id: 64, name: 'Dominican Republic' },
  { id: 65, name: 'Algeria' },
  { id: 66, name: 'Ecuador' },
  { id: 67, name: 'Egypt' },
  { id: 68, name: 'Eritrea' },
  { id: 69, name: 'Western Sahara' },
  { id: 70, name: 'Spain' },
  { id: 71, name: 'Estonia' },
  { id: 72, name: 'Ethiopia' },
  { id: 73, name: 'Finland' },
  { id: 74, name: 'Fiji' },
  { id: 75, name: 'Falkland Islands (Malvinas)' },
  { id: 76, name: 'France' },
  { id: 77, name: 'Faroe Islands' },
  { id: 78, name: 'Micronesia, Federated States of' },
  { id: 79, name: 'Gabon' },
  { id: 80, name: 'United Kingdom' },
  { id: 81, name: 'Georgia' },
  { id: 82, name: 'Guernsey' },
  { id: 83, name: 'Ghana' },
  { id: 84, name: 'Gibraltar' },
  { id: 85, name: 'Guinea' },
  { id: 86, name: 'Guadeloupe' },
  { id: 87, name: 'Gambia' },
  { id: 88, name: 'Guinea-Bissau' },
  { id: 89, name: 'Equatorial Guinea' },
  { id: 90, name: 'Greece' },
  { id: 91, name: 'Grenada' },
  { id: 92, name: 'Greenland' },
  { id: 93, name: 'Guatemala' },
  { id: 94, name: 'French Guiana' },
  { id: 95, name: 'Guam' },
  { id: 96, name: 'Guyana' },
  { id: 97, name: 'Hong Kong' },
  { id: 98, name: 'Heard Island and McDonald Islands' },
  { id: 99, name: 'Honduras' },
  { id: 100, name: 'Croatia' },
  { id: 101, name: 'Haiti' },
  { id: 102, name: 'Hungary' },
  { id: 103, name: 'Indonesia' },
  { id: 104, name: 'Isle of Man' },
  { id: 105, name: 'India' },
  { id: 106, name: 'British Indian Ocean Territory' },
  { id: 107, name: 'Ireland' },
  { id: 108, name: 'Iran, Islamic Republic of' },
  { id: 109, name: 'Iraq' },
  { id: 110, name: 'Iceland' },
  { id: 111, name: 'Israel' },
  { id: 112, name: 'Italy' },
  { id: 113, name: 'Jamaica' },
  { id: 114, name: 'Jersey' },
  { id: 115, name: 'Jordan' },
  { id: 116, name: 'Japan' },
  { id: 117, name: 'Kazakhstan' },
  { id: 118, name: 'Kenya' },
  { id: 119, name: 'Kyrgyzstan' },
  { id: 120, name: 'Cambodia' },
  { id: 121, name: 'Kiribati' },
  { id: 122, name: 'Saint Kitts and Nevis' },
  { id: 123, name: 'Korea, Republic of' },
  { id: 124, name: 'Kuwait' },
  { id: 125, name: "Lao People's Democratic Republic" },
  { id: 126, name: 'Lebanon' },
  { id: 127, name: 'Liberia' },
  { id: 128, name: 'Libya' },
  { id: 129, name: 'Saint Lucia' },
  { id: 130, name: 'Liechtenstein' },
  { id: 131, name: 'Sri Lanka' },
  { id: 132, name: 'Lesotho' },
  { id: 133, name: 'Lithuania' },
  { id: 134, name: 'Luxembourg' },
  { id: 135, name: 'Latvia' },
  { id: 136, name: 'Macao' },
  { id: 137, name: 'Saint Martin (French part)' },
  { id: 138, name: 'Morocco' },
  { id: 139, name: 'Monaco' },
  { id: 140, name: 'Moldova, Republic of' },
  { id: 141, name: 'Madagascar' },
  { id: 142, name: 'Maldives' },
  { id: 143, name: 'Mexico' },
  { id: 144, name: 'Marshall Islands' },
  { id: 145, name: 'North Macedonia' },
  { id: 146, name: 'Mali' },
  { id: 147, name: 'Malta' },
  { id: 148, name: 'Myanmar' },
  { id: 149, name: 'Montenegro' },
  { id: 150, name: 'Mongolia' },
  { id: 151, name: 'Northern Mariana Islands' },
  { id: 152, name: 'Mozambique' },
  { id: 153, name: 'Mauritania' },
  { id: 154, name: 'Montserrat' },
  { id: 155, name: 'Martinique' },
  { id: 156, name: 'Mauritius' },
  { id: 157, name: 'Malawi' },
  { id: 158, name: 'Malaysia' },
  { id: 159, name: 'Mayotte' },
  { id: 160, name: 'Namibia' },
  { id: 161, name: 'New Caledonia' },
  { id: 162, name: 'Niger' },
  { id: 163, name: 'Norfolk Island' },
  { id: 164, name: 'Nigeria' },
  { id: 165, name: 'Nicaragua' },
  { id: 166, name: 'Niue' },
  { id: 167, name: 'Netherlands' },
  { id: 168, name: 'Norway' },
  { id: 169, name: 'Nepal' },
  { id: 170, name: 'Nauru' },
  { id: 171, name: 'New Zealand' },
  { id: 172, name: 'Oman' },
  { id: 173, name: 'Pakistan' },
  { id: 174, name: 'Panama' },
  { id: 175, name: 'Pitcairn' },
  { id: 176, name: 'Peru' },
  { id: 177, name: 'Philippines' },
  { id: 178, name: 'Palau' },
  { id: 179, name: 'Papua New Guinea' },
  { id: 180, name: 'Poland' },
  { id: 181, name: 'Puerto Rico' },
  { id: 182, name: "Korea, Democratic People's Republic of" },
  { id: 183, name: 'Portugal' },
  { id: 184, name: 'Paraguay' },
  { id: 185, name: 'Palestine, State of' },
  { id: 186, name: 'French Polynesia' },
  { id: 187, name: 'Qatar' },
  { id: 188, name: 'Réunion' },
  { id: 189, name: 'Romania' },
  { id: 190, name: 'Russian Federation' },
  { id: 191, name: 'Rwanda' },
  { id: 192, name: 'Saudi Arabia' },
  { id: 193, name: 'Sudan' },
  { id: 194, name: 'Senegal' },
  { id: 195, name: 'Singapore' },
  { id: 196, name: 'South Georgia and the South Sandwich Islands' },
  { id: 197, name: 'Saint Helena, Ascension and Tristan da Cunha' },
  { id: 198, name: 'Svalbard and Jan Mayen' },
  { id: 199, name: 'Solomon Islands' },
  { id: 200, name: 'Sierra Leone' },
  { id: 201, name: 'El Salvador' },
  { id: 202, name: 'San Marino' },
  { id: 203, name: 'Somalia' },
  { id: 204, name: 'Saint Pierre and Miquelon' },
  { id: 205, name: 'Serbia' },
  { id: 206, name: 'South Sudan' },
  { id: 207, name: 'Sao Tome and Principe' },
  { id: 208, name: 'Suriname' },
  { id: 209, name: 'Slovakia' },
  { id: 210, name: 'Slovenia' },
  { id: 211, name: 'Sweden' },
  { id: 212, name: 'Eswatini' },
  { id: 213, name: 'Sint Maarten (Dutch part)' },
  { id: 214, name: 'Seychelles' },
  { id: 215, name: 'Syrian Arab Republic' },
  { id: 216, name: 'Turks and Caicos Islands' },
  { id: 217, name: 'Chad' },
  { id: 218, name: 'Togo' },
  { id: 219, name: 'Thailand' },
  { id: 220, name: 'Tajikistan' },
  { id: 221, name: 'Tokelau' },
  { id: 222, name: 'Turkmenistan' },
  { id: 223, name: 'Timor-Leste' },
  { id: 224, name: 'Tonga' },
  { id: 225, name: 'Trinidad and Tobago' },
  { id: 226, name: 'Tunisia' },
  { id: 227, name: 'Turkey' },
  { id: 228, name: 'Tuvalu' },
  { id: 229, name: 'Taiwan, Province of China' },
  { id: 230, name: 'Tanzania, United Republic of' },
  { id: 231, name: 'Uganda' },
  { id: 232, name: 'Ukraine' },
  { id: 233, name: 'United States Minor Outlying Islands' },
  { id: 234, name: 'Uruguay' },
  { id: 235, name: 'United States' },
  { id: 236, name: 'Uzbekistan' },
  { id: 237, name: 'Holy See (Vatican City State)' },
  { id: 238, name: 'Saint Vincent and the Grenadines' },
  { id: 239, name: 'Venezuela, Bolivarian Republic of' },
  { id: 240, name: 'Virgin Islands, British' },
  { id: 241, name: 'Virgin Islands, U.S.' },
  { id: 242, name: 'Viet Nam' },
  { id: 243, name: 'Vanuatu' },
  { id: 244, name: 'Wallis and Futuna' },
  { id: 245, name: 'Samoa' },
  { id: 246, name: 'Yemen' },
  { id: 247, name: 'South Africa' },
  { id: 248, name: 'Zambia' },
  { id: 249, name: 'Zimbabwe' }
];

export const projectStatusOption = [
  {
    id: 1,
    name: 'Active',
    value: 'active',
    color: '#FFC023'
  },
  {
    id: 2,
    name: 'Delivered',
    value: 'delivered',
    color: '#5EB85C'
  },
  {
    id: 3,
    name: 'Hired',
    value: 'hired',
    color: '#ffc881'
  },
  {
    id: 4,
    name: 'Disputed',
    value: 'disputed',
    color: '#5F3A6B'
  },
  {
    id: 5,
    name: 'Cancelled',
    value: 'cancelled',
    color: '#FB4A49'
  },
  {
    id: 6,
    name: 'Suspended',
    value: 'suspended',
    color: '#2616DE'
  }
];

export const milestoneStatusOption = [
  {
    id: '1',
    name: 'High',
    color: '#FB4A49'
  },
  {
    id: '2',
    name: 'Medium',
    color: '#FFC023'
  },
  {
    id: '3',
    name: 'Low',
    color: '#5EB85C'
  }
];

export const fileTypesArray = [
  {
    label: 'Photo',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
  },
  {
    label: 'Document',
    extensions: ['xls', 'xlsx', 'csv', 'pdf']
  }
];

export const FileType = [
  {
    label: 'Photo',
    value: 'Photo'
  },
  {
    label: 'Media',
    value: 'Media'
  },
  {
    label: 'Document',
    value: 'Document'
  }
];

export const HmsStatus = [
  {
    label: 'Assigned',
    value: 'assigned'
  },
  {
    label: 'Available',
    value: 'available'
  },
  {
    label: 'Maintenance',
    value: 'maintenance'
  },
  {
    label: 'Retired',
    value: 'retired'
  }
];

export const extensionTypes = [
  { label: 'jpg', value: 'jpg' },
  { label: 'jpeg', value: 'jpeg' },
  { label: 'png', value: 'png' },
  { label: 'webp', value: 'webp' },
  { label: 'pdf', value: 'pdf' },
  { label: 'xls', value: 'xls' },
  { label: 'xlsx', value: 'xlsx' }
];

export const qualifications = [
  { value: 'High School Diploma', label: 'High School Diploma' },
  { value: 'intermediate', label: 'Higher Secondary (12th Grade) / Intermediate' },
  { value: 'Diploma in Information Technology', label: 'Diploma in Information Technology' },

  {
    value: 'Bachelor of Science in Computer Science',
    label: 'Bachelor of Science in Computer Science'
  },
  {
    value: 'Bachelor of Science in Information Technology',
    label: 'Bachelor of Science in Information Technology'
  },
  {
    value: 'Bachelor of Technology in Computer Science',
    label: 'Bachelor of Technology in Computer Science'
  },
  {
    value: 'Bachelor of Technology in Information Technology',
    label: 'Bachelor of Technology in Information Technology'
  },
  {
    value: 'Bachelor of Computer Applications (BCA)',
    label: 'Bachelor of Computer Applications (BCA)'
  },
  {
    value: 'Bachelor of Engineering in Software Engineering',
    label: 'Bachelor of Engineering in Software Engineering'
  },

  {
    value: 'Master of Science in Computer Science',
    label: 'Master of Science in Computer Science'
  },
  { value: 'Master of Science in Data Science', label: 'Master of Science in Data Science' },
  {
    value: 'Master of Technology in Computer Science',
    label: 'Master of Technology in Computer Science'
  },
  {
    value: 'Master of Technology in Information Technology',
    label: 'Master of Technology in Information Technology'
  },
  {
    value: 'Master of Computer Applications (MCA)',
    label: 'Master of Computer Applications (MCA)'
  },
  {
    value: 'Master of Engineering in Software Engineering',
    label: 'Master of Engineering in Software Engineering'
  },
  { value: 'MBBS', label: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)' },
  { value: 'Ph.D. in Computer Science', label: 'Ph.D. in Computer Science' },
  { value: 'Ph.D. in Information Technology', label: 'Ph.D. in Information Technology' }
];

export const educationType = [
  { value: 'Regular (Full-time)', label: 'Regular (Full-time)' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Distance Education', label: 'Distance Education' },
  { value: 'Online', label: 'Online' },
  { value: 'Open University', label: 'Open University' },
  { value: 'Evening Classes', label: 'Evening Classes' },
  { value: 'Correspondence', label: 'Correspondence' },
  { value: 'Non-attending', label: 'Non-attending' }
];

export const platformOptions = [
  { label: 'Gmail', value: 'Gmail' },
  { label: 'Gitlab', value: 'Gitlab' },
  { label: 'Github', value: 'Github' },
  { label: 'Bitbucket', value: 'Bitbucket' }
];

export const reportingDonePoints = [
  'Code Pushed on Repo',
  'Reported to client',
  'Shared build with client',
  'Reported to Reported Manager',
  'Today Assigned Task Completed',
  'No Un-attended Message from client'
];

export const KeysObj = {
  project: 'project_id',
  employee: 'employee_id',
  hms: 'device_id'
};

export const navigationData = {
  project: {
    apiPath: 'project',
    name: 'Project',
    route: '/project',
    middleRoute: 'project/details'
  },
  employee: {
    apiPath: 'employee',
    name: 'Employees',
    route: '/employee',
    middleRoute: 'view-employee'
  },
  hms: {
    apiPath: 'hms',
    name: 'HMS',
    route: '/hms',
    middleRoute: 'hms/details'
  },
  profile: {
    apiPath: 'employee',
    name: 'Profile',
    route: '/my-profile'
  }
};

export const avatarColors = [
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
  '#87d068',
  '#1890ff',
  '#eb2f96',
  '#fa541c',
  '#13c2c2',
  '#2f54eb',
  '#a0d911',
  '#722ed1'
];

export const leave_type = [
  { label: 'Casual Leave (CL)', value: 'Casual Leave' },
  { label: 'Sick Leave (SL)', value: 'Sick Leave' },
  { label: 'Earned Leave (EL)', value: 'Earned Leave' },
  { label: 'Compensatory Off (CompOff)', value: 'Compensatory Off' },
  { label: 'Maternity Leave (ML)', value: 'Maternity Leave' },
  { label: 'Paternity Leave (PL)', value: 'Paternity Leave' },
  { label: 'Bereavement Leave (BL)', value: 'Bereavement Leave' },
  { label: 'Marriage Leave (MarL)', value: 'Marriage Leave' },
  { label: 'Leave Without Pay (LWP)', value: 'Leave Without Pay' }
];

export const ProjectSource = [
  { label: 'Upwork', value: 'Upwork' },
  { label: 'Linked In', value: 'Linked In' },
  { label: 'Freelancer', value: 'Freelancer' },
  { label: 'Fiverr', value: 'Fiverr' },
  { label: 'Toptal', value: 'Toptal' },
  { label: 'PeoplePerHour', value: 'PeoplePerHour' },
  { label: 'Guru', value: 'Guru' },
  { label: 'Hubstaff Talent', value: 'Hubstaff Talent' },
  { label: 'Other', value: 'Other' }
];

export const projectBillingType = [
  {
    label: 'Hourly',
    value: 'hourly'
  },
  {
    label: 'Fixed Price',
    value: 'fixed_price'
  },
  {
    label: 'Milestone-Based',
    value: 'milestone_based'
  },
  {
    label: 'Retainer',
    value: 'retainer'
  },
  {
    label: 'Time & Material',
    value: 'time_and_material'
  },
  {
    label: 'Not Decided Yet',
    value: 'not_decided'
  },
  {
    label: 'Negotiable',
    value: 'negotiable'
  }
];

export const projectCondition = [
  { label: 'New Project', value: 'new' },
  { label: 'Existing Project', value: 'existing' },
  { label: 'Ongoing Support', value: 'support' },
  { label: 'Bug Fixes', value: 'bug_fixes' },
  { label: 'Feature Request', value: 'feature_request' }
];

export const projectPhase = [
  { label: 'Phase 1', value: '1' },
  { label: 'Phase 2', value: '2' }
];

export const bankOptions = [
  { label: 'State Bank of India', value: 'State Bank of India' },
  { label: 'HDFC Bank', value: 'HDFC Bank' },
  { label: 'ICICI Bank', value: 'ICICI Bank' },
  { label: 'Axis Bank', value: 'Axis Bank' },
  { label: 'Punjab National Bank', value: 'Punjab National Bank' },
  { label: 'Bank of Baroda', value: 'Bank of Baroda' },
  { label: 'Canara Bank', value: 'Canara Bank' },
  { label: 'Union Bank of India', value: 'Union Bank of India' },
  { label: 'Kotak Mahindra Bank', value: 'Kotak Mahindra Bank' },
  { label: 'IndusInd Bank', value: 'IndusInd Bank' },
  { label: 'IDFC FIRST Bank', value: 'IDFC FIRST Bank' },
  { label: 'Yes Bank', value: 'Yes Bank' },
  { label: 'Federal Bank', value: 'Federal Bank' },
  { label: 'Indian Bank', value: 'Indian Bank' },
  { label: 'Bank of India', value: 'Bank of India' },
  { label: 'IDBI Bank', value: 'IDBI Bank' },
  { label: 'UCO Bank', value: 'UCO Bank' },
  { label: 'Indian Overseas Bank', value: 'Indian Overseas Bank' },
  { label: 'Punjab & Sind Bank', value: 'Punjab & Sind Bank' },
  { label: 'Central Bank of India', value: 'Central Bank of India' },
  { label: 'South Indian Bank', value: 'South Indian Bank' },
  { label: 'Karur Vysya Bank', value: 'Karur Vysya Bank' },
  { label: 'City Union Bank', value: 'City Union Bank' },
  { label: 'Tamilnad Mercantile Bank', value: 'Tamilnad Mercantile Bank' },
  { label: 'RBL Bank', value: 'RBL Bank' },
  { label: 'DCB Bank', value: 'DCB Bank' },
  { label: 'Dhanlaxmi Bank', value: 'Dhanlaxmi Bank' },
  { label: 'Jammu & Kashmir Bank', value: 'Jammu & Kashmir Bank' },
  { label: 'Karnataka Bank', value: 'Karnataka Bank' },
  { label: 'Bandhan Bank', value: 'Bandhan Bank' },
  { label: 'AU Small Finance Bank', value: 'AU Small Finance Bank' },
  { label: 'Equitas Small Finance Bank', value: 'Equitas Small Finance Bank' },
  { label: 'Ujjivan Small Finance Bank', value: 'Ujjivan Small Finance Bank' },
  { label: 'Suryoday Small Finance Bank', value: 'Suryoday Small Finance Bank' },
  { label: 'ESAF Small Finance Bank', value: 'ESAF Small Finance Bank' },
  { label: 'North East Small Finance Bank', value: 'North East Small Finance Bank' },
  { label: 'Capital Small Finance Bank', value: 'Capital Small Finance Bank' },
  { label: 'Fincare Small Finance Bank', value: 'Fincare Small Finance Bank' },
  { label: 'Jana Small Finance Bank', value: 'Jana Small Finance Bank' },
  { label: 'Shivalik Small Finance Bank', value: 'Shivalik Small Finance Bank' },
  { label: 'NSDL Payments Bank', value: 'NSDL Payments Bank' },
  { label: 'India Post Payments Bank', value: 'India Post Payments Bank' },
  { label: 'Airtel Payments Bank', value: 'Airtel Payments Bank' },
  { label: 'Paytm Payments Bank', value: 'Paytm Payments Bank' },
  { label: 'Fino Payments Bank', value: 'Fino Payments Bank' },
  { label: 'Standard Chartered Bank', value: 'Standard Chartered Bank' },
  { label: 'HSBC Bank', value: 'HSBC Bank' },
  { label: 'Deutsche Bank', value: 'Deutsche Bank' },
  { label: 'Citi Bank', value: 'Citi Bank' },
  { label: 'DBS Bank India', value: 'DBS Bank India' }
];

export const leaveOptions = [
  { label: 'Full-Day Leave', value: 'FD' },
  { label: 'Half-Day Leave', value: 'HD' },
  { label: 'Short-Duration Leave', value: 'SL' }
];

export const leaveStatus = [
  { label: 'Approved', value: 'approved' },
  { label: 'Declined', value: 'declined' },
  { label: 'Pending', value: 'pending' }
];

export const LeaveStatusEnum = {
  APPROVED: 'approved',
  DECLINED: 'declined',
  PENDING: 'pending'
};

export const halfDayOptions = [
  { label: 'First-Half Leave', value: 'FH' },
  { label: 'Second-Half Leave', value: 'SH' }
];

export const frequencyOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Yearly', value: 'yearly' }
];

export const BillingAllStatus = [
  {
    label: 'Available',
    value: 'available'
  },
  {
    label: 'Occupied',
    value: 'occupied'
  }
];

export const BillingSortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Username', value: 'user_name' }
];

export const LeaveTabOptions = [
  { label: 'Upcoming Leaves', value: 'upcoming' },
  { label: 'Past Leaves', value: 'past' }
];

export const HMSTabOptions = [
  { label: 'Inventory', value: 'Inventory' },
  { label: 'Assignee', value: 'Assignee' }
];

export const userIsEmployee = 'standard';

// Common ENUMs
export const actionTypeEnums = {
  CREATE: 'create',
  DELETE: 'del',
  UPDATE: 'update',
  READ: 'read'
};

export const NotificationTab = [
  {
    label: 'Sent',
    value: 'sent'
  },
  {
    label: 'Drafts',
    value: 'drafts'
  }
];

// Notification ENUMs
export const notificationActiveTabEnums = {
  NOTIFICATIONS: 'Notifications',
  DRAFTS: 'Drafts',
  SENT: 'Sent'
};

export const notificationSendToEnums = {
  ALL: 'All',
  DEPARTMENT: 'Department',
  EMPLOYEE: 'Employee'
};

// HMS ENUMs
export const hmsTabEnum = {
  INVENTORY: 'Inventory',
  ASSIGNEE: 'Assignee'
};

export const hmsStatusEnum = {
  ASSIGNED: 'assigned',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired',
  AVAILABLE: 'available'
};

export const hmsSectionEnum = {
  BASIC_INFO: 'Basic Info',
  PROCUREMENT_INFO: 'Procurement Info',
  WARRANTY_INFO: 'Warranty Info',
  SPECIFICATIONS: 'Specifications'
};

export const HmsSectionStepMap = {
  [hmsSectionEnum.BASIC_INFO]: 1,
  [hmsSectionEnum.PROCUREMENT_INFO]: 2,
  [hmsSectionEnum.WARRANTY_INFO]: 2,
  [hmsSectionEnum.SPECIFICATIONS]: 3
};
// LMS and Request Section Tab Enum
export const leaveTabEnum = {
  UPCOMING: 'upcoming',
  PAST: 'past'
};

export const deviceTypes = [
  { label: 'Desktop', value: 'Desktop' },
  { label: 'Mac', value: 'Mac' },
  { label: 'Laptop', value: 'Laptop' },
  { label: 'Tablet', value: 'Tablet' },
  { label: 'iPhone', value: 'iPhone' },
  { label: 'Android', value: 'Android' },
  { label: 'Keyboard', value: 'Keyboard' },
  { label: 'Mouse', value: 'Mouse' },
  { label: 'Monitor', value: 'Monitor' },
  { label: 'Headphones', value: 'Headphones' }
];

export const devicesContainSpecification = ['Desktop', 'Mac', 'Laptop'];

export const ramOptions = [
  { label: '2 GB', value: '2 GB' },
  { label: '4 GB', value: '4 GB' },
  { label: '8 GB', value: '8 GB' },
  { label: '16 GB', value: '16 GB' },
  { label: '32 GB', value: '32 GB' },
  { label: '64 GB', value: '64 GB' },
  { label: '128 GB', value: '128 GB' },
  { label: '256 GB', value: '256 GB' }
];

export const storageOptions = [
  { label: '16 GB', value: '16 GB' },
  { label: '32 GB', value: '32 GB' },
  { label: '64 GB', value: '64 GB' },
  { label: '128 GB', value: '128 GB' },
  { label: '256 GB', value: '256 GB' },
  { label: '512 GB', value: '512 GB' },
  { label: '1 TB', value: '1 TB' },
  { label: '2 TB', value: '2 TB' },
  { label: '4 TB', value: '4 TB' },
  { label: '8 TB', value: '8 TB' }
];

export const graphicsOptions = [
  { label: 'Integrated Graphics', value: 'Integrated Graphics' },
  { label: 'Intel Iris Xe', value: 'Intel Iris Xe' },
  { label: 'Intel UHD Graphics', value: 'Intel UHD Graphics' },
  { label: 'AMD Radeon Graphics', value: 'AMD Radeon Graphics' },
  { label: 'AMD Radeon Pro', value: 'AMD Radeon Pro' },
  { label: 'Apple M1 GPU', value: 'Apple M1 GPU' },
  { label: 'Apple M2 GPU', value: 'Apple M2 GPU' },
  { label: 'Apple M3 GPU', value: 'Apple M3 GPU' },
  { label: 'NVIDIA GeForce GTX 1650', value: 'NVIDIA GeForce GTX 1650' },
  { label: 'NVIDIA GeForce RTX 3050', value: 'NVIDIA GeForce RTX 3050' },
  { label: 'NVIDIA GeForce RTX 3060', value: 'NVIDIA GeForce RTX 3060' },
  { label: 'NVIDIA GeForce RTX 3070', value: 'NVIDIA GeForce RTX 3070' },
  { label: 'NVIDIA GeForce RTX 3080', value: 'NVIDIA GeForce RTX 3080' },
  { label: 'NVIDIA GeForce RTX 4060', value: 'NVIDIA GeForce RTX 4060' },
  { label: 'NVIDIA GeForce RTX 4070', value: 'NVIDIA GeForce RTX 4070' },
  { label: 'NVIDIA GeForce RTX 4080', value: 'NVIDIA GeForce RTX 4080' },
  { label: 'NVIDIA GeForce RTX 4090', value: 'NVIDIA GeForce RTX 4090' },
  { label: 'NVIDIA Quadro', value: 'NVIDIA Quadro' }
];

export const osOptions = [
  { label: 'Windows 11', value: 'Windows 11' },
  { label: 'Windows 10', value: 'Windows 10' },
  { label: 'Windows 8.1', value: 'Windows 8.1' },
  { label: 'macOS Sonoma', value: 'macOS Sonoma' },
  { label: 'macOS Ventura', value: 'macOS Ventura' },
  { label: 'macOS Monterey', value: 'macOS Monterey' },
  { label: 'macOS Big Sur', value: 'macOS Big Sur' },
  { label: 'Ubuntu', value: 'Ubuntu' },
  { label: 'Fedora', value: 'Fedora' },
  { label: 'Debian', value: 'Debian' },
  { label: 'Linux Mint', value: 'Linux Mint' },
  { label: 'Arch Linux', value: 'Arch Linux' },
  { label: 'Pop!_OS', value: 'Pop!_OS' },
  { label: 'Other', value: 'Other' }
];

export const HmsInternalTabOptions = [
  { label: 'Hardware Info', value: 'Hardware Info' },
  { label: 'Assigned To', value: 'Assigned To' },
  { label: 'Documents', value: 'Documents' },
  { label: 'Remarks', value: 'Remarks' }
];

export const HmsInternalTabEnum = {
  HARDWARE_INFO: 'Hardware Info',
  ASSIGNED_TO: 'Assigned To',
  DOCUMENTS: 'Documents',
  REMARKS: 'Remarks'
};

export const LmsGraphFilterEnum = {
  MONTHLY: 'monthly',
  WEEKLY: 'weekly',
  YEARLY: 'yearly'
};

export const ReportingRangeOptions = [
  { label: 'Today', value: 'selectedDate' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Last 30 Days', value: 'last30days' },
  { label: 'Custom Range', value: 'customRange' }
];
