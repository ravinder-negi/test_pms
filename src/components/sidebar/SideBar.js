import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, ListItemText, ListItemButton } from '@mui/material';
import { SidebarBox, ListItemStyle, LinkStyle, LogoutBox } from './style';
import { checkActiveTab, useWindowWide } from '../../utils/common_functions';
import { LogoutNewIcon, TrashIconNew } from '../../theme/SvgIcons';
import { menuItems } from '../../utils/constant';
import ConfirmationModal from '../Modal/ConfirmationModal';
import { toast } from 'react-toastify';
import { updateActivityDrawer } from '../../redux/sidebar/SidebarSlice';
import { logout } from '../../redux/globalAction';
import useFilteredMenuItems from '../../hooks/useFilteredMenuItems';
import { setSelectResponseMenu } from '../../redux/sign-in/userInfoSlice';

const SideBar = () => {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const loc = useLocation();
  const largeScreen = useWindowWide(750);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user_details, permissions, isEmployee, isSidebarOpen } = useSelector((state) => ({
    user_details: state?.userInfo?.data?.user_details,
    permissions: state?.userInfo?.data?.permissions,
    isEmployee: state?.userInfo?.isEmployee,
    isSidebarOpen: state?.sidebar?.isSidebarOpen
  }));

  const filteredMenuItems = useFilteredMenuItems(permissions, isEmployee, menuItems);

  const handleLogout = () => {
    setDeleteLoading(true);
    dispatch(logout());
    toast.success('Logout Successfully');
    setDeleteLoading(false);
    navigate('/');
  };

  const handleSelection = (e) => dispatch(setSelectResponseMenu(e));

  useEffect(() => {
    const activeTab = checkActiveTab(loc.pathname);
    setSelectedMenu(activeTab);
    dispatch(updateActivityDrawer(false));
  }, [loc, dispatch]);

  return (
    largeScreen && (
      <SidebarBox isSidebarOpen={isSidebarOpen}>
        {openLogoutModal && (
          <ConfirmationModal
            open={openLogoutModal}
            onCancel={() => setOpenLogoutModal(false)}
            title="Logout"
            onSubmit={handleLogout}
            buttonName="Yes"
            description="Are you sure you want to logout this account?"
            iconBG="#FB4A49"
            icon={<TrashIconNew />}
            loading={deleteLoading}
          />
        )}
        <List>
          {filteredMenuItems.map((_item, key) => (
            <LinkStyle
              key={key}
              to={
                _item?.path?.includes('my-profile')
                  ? `${_item?.path}/${user_details?.id}`
                  : _item.path
              }
              state={{ project_id: user_details?.id }}>
              <ListItemStyle
                key={_item.id}
                disablePadding
                isSidebarOpen={isSidebarOpen}
                className={selectedMenu === _item.name ? 'active' : ''}>
                <ListItemButton
                  className={!isSidebarOpen ? 'close-sidebar-btn' : ''}
                  onClick={() => {
                    setSelectedMenu(_item.name);
                    handleSelection(_item.id);
                  }}>
                  {_item.icon}
                  {isSidebarOpen && <ListItemText primary={_item.name} />}
                </ListItemButton>
              </ListItemStyle>
            </LinkStyle>
          ))}
        </List>
        <LogoutBox
          className={!isSidebarOpen ? 'close-sidebar-btn' : ''}
          onClick={() => setOpenLogoutModal(true)}>
          <LogoutNewIcon />
          {isSidebarOpen && <h4>Logout</h4>}
        </LogoutBox>
      </SidebarBox>
    )
  );
};

export default memo(SideBar);
