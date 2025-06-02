import PMSRoutes from './routes/pmsRoutes';
import '../src/utils/Global.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { updateActiveTab } from './redux/employee/EmployeeSlice';
import { updateActiveTabPro } from './redux/project/ProjectSlice';
import { updateLmsTab } from './redux/lms/LmsSlice';
import { updateHmsTab, updateInternalHmsTab } from './redux/hms/HmsSlice';
import { updateRequestTab } from './redux/request/RequestSlice';
import { updateNotificationTab } from './redux/notification/NotificationSlice';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.includes('view-employee')) {
      dispatch(updateActiveTab('General Info'));
    }
    if (!location.pathname.includes('project/details')) {
      dispatch(updateActiveTabPro('General Info'));
    }
    if (!location.pathname.includes('lms')) {
      dispatch(updateLmsTab('upcoming'));
    }
    if (!location.pathname.includes('requests')) {
      dispatch(updateRequestTab('upcoming'));
    }
    if (!location.pathname.includes('hms')) {
      dispatch(updateHmsTab('Inventory'));
      dispatch(updateInternalHmsTab('Hardware Info'));
    }
    if (!location.pathname.includes('notification')) {
      dispatch(updateNotificationTab('Sent'));
    }
  }, [location.pathname]);

  return <PMSRoutes />;
}

export default App;
