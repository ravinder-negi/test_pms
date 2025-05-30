import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import {
  LogoutIcon,
  NavNotificationIcon,
  NavPasswordIcon,
  NavProfileIcon
} from '../../theme/SvgIcons';
import UpdatePassword from '../../modules/employees/view-employee/modals/UpdatePassword';

function Logout({ loggedUser, setIsLogoutOpen, setOpenLogoutModal }) {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const [deleteLoading, setDeleteLoading] = React.useState(false);
  // const [openLogoutModal, setOpenLogoutModal] = React.useState(false);
  const [passwordModal, setPasswordModal] = React.useState(false);
  const { isEmployee } = useSelector((state) => state?.userInfo) || {};

  // const handleLogout = () => {
  //   setDeleteLoading(true);
  //   dispatch(signInRes(''));
  //   dispatch(updateDocActiveTab(1));
  //   toast.success('Logout Successfully');
  //   setDeleteLoading(false);
  //   navigate('/');
  // };
  const handleOpenModal = () => setOpenLogoutModal(true);
  // const handleNavigates = () => navigate('/profile');

  return (
    <>
      {/* <ListItem
        style={{ justifyContent: 'center', background: 'inherit', cursor: 'pointer', gap: '25px' }}>
        <ChipStyle label={loggedUser} color="success" />
      </ListItem> */}
      {/* <ListItem
        style={{ background: 'inherit', cursor: 'pointer', gap: '25px' }}
        onClick={handleNavigates}>
        <ProfileIcon />
        <ListItemText primary="profile" />
      </ListItem> */}
      {isEmployee && (
        <ListItem
          sx={{
            background: 'inherit',
            cursor: 'pointer',
            gap: '10px',
            padding: '12px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#7C71FF',
              color: 'white'
            }
          }}
          onClick={() => {
            navigate(`my-profile/${loggedUser}`);
            setIsLogoutOpen(false);
          }}>
          <NavProfileIcon />
          <ListItemText primary="My Profile" />
        </ListItem>
      )}
      <ListItem
        sx={{
          background: 'inherit',
          cursor: 'pointer',
          gap: '10px',
          padding: '12px',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#7C71FF',
            color: 'white'
          }
        }}
        onClick={() => setPasswordModal(true)}>
        <NavPasswordIcon />
        <ListItemText primary="Change Password" />
      </ListItem>
      {isEmployee && (
        <ListItem
          sx={{
            background: 'inherit',
            cursor: 'pointer',
            gap: '10px',
            padding: '12px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#7C71FF',
              color: 'white'
            }
          }}>
          <NavNotificationIcon />
          <ListItemText primary="Notification Setting" />
        </ListItem>
      )}
      <ListItem
        sx={{
          background: 'inherit',
          cursor: 'pointer',
          gap: '10px',
          padding: '12px',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#7C71FF',
            color: 'white',
            '& > *': {
              color: 'white'
            }
          }
        }}
        onClick={handleOpenModal}>
        <LogoutIcon />
        <ListItemText primary="Logout" />
      </ListItem>
      {/* {openLogoutModal && (
        <ConfirmationModal
          open={openLogoutModal}
          onCancel={() => setOpenLogoutModal(false)}
          title={'Logout'}
          onSubmit={handleLogout}
          buttonName={'Yes'}
          description={'Are you sure you want to logout this account?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )} */}
      {passwordModal && (
        <UpdatePassword open={passwordModal} onClose={() => setPasswordModal(false)} />
      )}
    </>
  );
}
Logout.propTypes = {
  loggedUser: PropTypes.string,
  setIsLogoutOpen: PropTypes.func,
  setOpenLogoutModal: PropTypes.func
};
export default Logout;
