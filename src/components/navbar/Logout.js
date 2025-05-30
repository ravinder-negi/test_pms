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
  const [passwordModal, setPasswordModal] = React.useState(false);
  const { isEmployee } = useSelector((state) => state?.userInfo) || {};
  const handleOpenModal = () => setOpenLogoutModal(true);

  return (
    <>
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
