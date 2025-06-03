import { useLocation } from 'react-router-dom';

export const useCurrentModule = () => {
  const location = useLocation();
  const currentPath = location?.pathname;

  if (!currentPath) return false;

  if (currentPath.includes('my-profile')) {
    return 'my-profile';
  }

  const moduleMapping = {
    project: 'Projects',
    employee: 'Employee',
    hms: 'HMS',
    notification: 'Notifications',
    report: 'Reporting',
    lms: 'LMS',
    billingids: 'Billing Ids'
  };

  const matchedKey = Object.keys(moduleMapping).find((key) =>
    currentPath.toLowerCase().includes(key)
  );

  return matchedKey ? moduleMapping[matchedKey] : '';
};
