import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, ClickAwayListener, IconButton, List } from '@mui/material';
import MenuDrawer from '../sidebar/menuDrawer';
import Logout from './Logout';
import { generateEmployeeImgUrl, getFullName, useWindowWide } from '../../utils/common_functions';
import {
  DownArrow,
  SunfocusLogo,
  MenuIcon,
  ToogleSidebarIcon,
  NotificationIconNew,
  SunfocusLogoSmall,
  HistoryIcon,
  TrashIconNew
} from '../../theme/SvgIcons';
import {
  NavBoxStyle,
  AvatarBox,
  IconButtonStyle,
  MenuBox,
  ChipWrapper,
  ToogleLogo,
  Heading
} from './style';
import { appRoutes } from '../../routes/path';
import { updateActivityDrawer, updateSidebar } from '../../redux/sidebar/SidebarSlice';
import AvatarImage from '../common/AvatarImage';
import { Drawer } from 'antd';
import NotificationDrawer from './NotificationDrawer';
import ConfirmationModal from '../Modal/ConfirmationModal';
import { toast } from 'react-toastify';
import { logout } from '../../redux/globalAction';

function NavBar() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const largeScreen = useWindowWide(750);
  const anotherLargeScreen = useWindowWide(950);
  const [currentTab, setCurrentTab] = useState('');
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSidebarOpen = useSelector((state) => state?.sidebar?.isSidebarOpen);
  const userDetails = useSelector((state) => state?.userInfo?.data?.user_details);
  const { isEmployee, role, loggedUserType } = useSelector((state) => state?.userInfo);

  const routeHeadings = [...appRoutes];

  const handleClickAway = () => setIsLogoutOpen(false);

  const handleLogout = () => {
    setDeleteLoading(true);
    dispatch(logout());
    toast.success('Logout Successfully');
    setDeleteLoading(false);
    navigate('/');
  };

  const handleOpenMenu = () => setOpenMenu(!openMenu);

  const shouldShowHistoryIcon = () => {
    const path = location?.pathname;
    const excludedPaths = ['dashboard', 'notification', 'reporting', 'attendance', 'requests'];
    return (
      path?.split('/')?.length <= 2 && !excludedPaths.some((excluded) => path?.includes(excluded))
    );
  };

  useEffect(() => {
    const current = routeHeadings?.find((route) => location?.pathname.includes(route?.path))?.name;
    setCurrentTab(current);
    if (openMenu) setOpenMenu(false);
  }, [location.pathname]);

  return (
    <NavBoxStyle>
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
      {notificationDrawer && (
        <Drawer
          width={490}
          title="Notifications"
          placement="right"
          closable
          prefixCls="activityCustomDrawer"
          onClose={() => setNotificationDrawer(false)}
          open={notificationDrawer}
          key="right">
          <NotificationDrawer close={() => setNotificationDrawer(false)} />
        </Drawer>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AvatarBox
          isSidebarOpen={isSidebarOpen}
          style={{
            width: isSidebarOpen && largeScreen ? '192px' : '33px',
            marginRight: !largeScreen && 0
          }}>
          {isSidebarOpen && largeScreen ? <SunfocusLogo /> : <SunfocusLogoSmall />}
          {largeScreen && (
            <ToogleLogo
              isSidebarOpen={isSidebarOpen}
              onClick={() => dispatch(updateSidebar(!isSidebarOpen))}>
              <ToogleSidebarIcon />
            </ToogleLogo>
          )}
        </AvatarBox>
        <Heading>{currentTab}</Heading>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', gap: '12px' }}>
        {largeScreen ? (
          <MenuBox onClick={() => setIsLogoutOpen(!isLogoutOpen)}>
            <AvatarImage
              style={{ height: '40px', width: '40px', fontSize: '18px' }}
              image={generateEmployeeImgUrl(userDetails?.id)}
              name={isEmployee ? userDetails?.first_name : role?.role}
            />
            <ChipWrapper>
              {anotherLargeScreen && (
                <>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                    {isEmployee
                      ? getFullName(
                          userDetails?.first_name,
                          userDetails?.middle_name,
                          userDetails?.last_name
                        )
                      : loggedUserType?.email}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#767676',
                      textTransform: 'capitalize'
                    }}>
                    {userDetails?.role_id?.role || role?.role}
                  </Typography>
                </>
              )}
            </ChipWrapper>
            <DownArrow />
          </MenuBox>
        ) : (
          <IconButton onClick={handleOpenMenu}>
            <MenuIcon />
          </IconButton>
        )}
        {isEmployee && (
          <IconButtonStyle onClick={() => setNotificationDrawer(true)}>
            <NotificationIconNew />
          </IconButtonStyle>
        )}
        {shouldShowHistoryIcon() && (
          <div onClick={() => dispatch(updateActivityDrawer(true))}>
            <IconButtonStyle>
              <HistoryIcon />
            </IconButtonStyle>
          </div>
        )}
        {isLogoutOpen && (
          <ClickAwayListener onClickAway={handleClickAway}>
            <List
              sx={{
                minWidth: 140,
                width: 'auto',
                maxWidth: 500,
                backgroundColor: 'white',
                position: 'absolute',
                top: '45px',
                zIndex: '999',
                padding: '4px',
                gap: '10px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
              <Logout
                setOpenLogoutModal={setOpenLogoutModal}
                loggedUser={userDetails?.id}
                setIsLogoutOpen={setIsLogoutOpen}
              />
            </List>
          </ClickAwayListener>
        )}
      </Box>
      {!largeScreen && openMenu && (
        <Drawer
          width={490}
          title="Notifications"
          placement="right"
          closable
          prefixCls="activityCustomDrawer"
          open={openMenu}
          onClose={() => setOpenMenu(false)}
          key="right">
          <MenuDrawer />
        </Drawer>
      )}
    </NavBoxStyle>
  );
}

export default NavBar;
