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

const PMSRoutes = () => {
  const userDetails = useSelector((e) => e?.userInfo?.data);
  const { isEmployee, token } = useSelector((e) => e?.userInfo);

  const allowedModules = new Set(
    userDetails?.permissions
      ?.filter((perm) => {
        let checkPermission = isEmployee && perm.module === 'Employee' ? false : true;
        if (perm.read && checkPermission) {
          return perm;
        }
      })
      .map((perm) => perm.module.toLowerCase())
  );

  const filteredMenuItems = menuItems.filter((item) => allowedModules.has(item.routeName));

  const PublicRoute = (token) => {
    // used to show update-password screen if any employee initially login
    if (userDetails?.user_details && userDetails?.user_details?.emp_password_status === false)
      return (
        <Navigate to="/update-password" state={{ id: userDetails?.user_details?.id }} replace />
      );
    if (token?.token) {
      if (filteredMenuItems?.find((item) => item?.routeName === 'dashboard'))
        return <Navigate to="/dashboard" replace />;
      else {
        return <Navigate to={filteredMenuItems?.[0]?.path} replace />;
      }
    }
    return <Outlet />;
  };

  const PrivateRoute = (token) => {
    if (!token?.token) return <Navigate to="/" />;
    return <Outlet />;
  };

  // Include routes that are either in `allowedModules` or in `alwaysVisibleRoutes`
  const skipFilterRoutes = isEmployee ? ['myprofile', 'requests'] : ['requests'];
  const filteredRoutes = appRoutes.filter(
    (route) => skipFilterRoutes.includes(route.routeName) || allowedModules.has(route.routeName)
  );

  return (
    <Routes>
      <Route element={<PublicRoute token={token} />}>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<SignIn />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="new-password" element={<NewPassword />} />
        </Route>
      </Route>
      <Route element={<PrivateRoute token={token} />}>
        <Route path="" element={<Layout />}>
          {filteredRoutes?.map((route, key) => (
            <Route key={key} path={`${route?.path}`} element={route?.Comp} />
          ))}
        </Route>

        <Route path="/update-password" element={<UpdatePassword />} />
      </Route>
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
};

export default memo(PMSRoutes);
