import { useMemo } from 'react';

const useFilteredMenuItems = (permissions, isEmployee, menuItems) => {
  const allowedModules = useMemo(() => {
    return new Set(
      permissions
        ?.filter((perm) => perm.read && (!isEmployee || perm.module !== 'Employee'))
        .map((perm) => perm.module.toLowerCase())
    );
  }, [permissions, isEmployee]);

  const filteredMenuItems = useMemo(() => {
    const commanRoute = ['requests'];
    const skipFilterRoutes = isEmployee ? ['myprofile', ...commanRoute] : commanRoute;
    return menuItems.filter(
      (item) => skipFilterRoutes.includes(item.routeName) || allowedModules.has(item.routeName)
    );
  }, [allowedModules, isEmployee, menuItems]);

  return filteredMenuItems;
};

export default useFilteredMenuItems;
