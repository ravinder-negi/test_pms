import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../layout/Layout';
import Notfound from '../components/Default-page/404-Page';
import { menuItems } from '../utils/constant';
import { appRoutes } from './path';
import UpdatePassword from '../modules/passwordUpdate/PasswordUpdate';
import AuthLayout from '../modules/auth/AuthLayout';
import ForgetPassword from '../modules/auth/ForgetPassword';
import SignIn from '../modules/auth/SignIn';
import NewPassword from '../modules/auth/NewPassword';
import { memo } from 'react';
import useFilteredMenuItems from '../hooks/useFilteredMenuItems';

const PMSRoutes = () => {
  const { data: userDetails, isEmployee, token } = useSelector((state) => state?.userInfo);

  const filteredMenuItems = useFilteredMenuItems(userDetails?.permissions, isEmployee, menuItems);
  const filteredRoutes = useFilteredMenuItems(userDetails?.permissions, isEmployee, appRoutes);

  const PublicRoute = () => {
    if (userDetails?.user_details?.emp_password_status === false) {
      return (
        <Navigate to="/update-password" state={{ id: userDetails?.user_details?.id }} replace />
      );
    }

    if (token) {
      const dashboardRoute = filteredMenuItems?.find((item) => item?.routeName === 'dashboard');
      return <Navigate to={dashboardRoute ? '/dashboard' : filteredMenuItems?.[0]?.path} replace />;
    }

    return <Outlet />;
  };

  const PrivateRoute = () => {
    return token ? <Outlet /> : <Navigate to="/" />;
  };

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<SignIn />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="new-password" element={<NewPassword />} />
        </Route>
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="" element={<Layout />}>
          {filteredRoutes?.map((route, key) => (
            <Route key={key} path={route?.path} element={route?.Comp} />
          ))}
        </Route>
        <Route path="/update-password" element={<UpdatePassword />} />
      </Route>
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
};

export default memo(PMSRoutes);
