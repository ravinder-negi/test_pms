import PMSRoutes from './routes/pmsRoutes';
import '../src/utils/Global.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { updateActiveTab } from './redux/employee/EmployeeSlice';
import { updateActiveTabPro } from './redux/project/ProjectSlice';
import { updateLmsTab } from './redux/lms/LmsSlice';

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
  }, [location.pathname]);

  return <PMSRoutes />;
}

export default App;
