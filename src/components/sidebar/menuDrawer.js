import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectResponseMenu } from '../../redux/sign-in/userInfoSlice';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import { LinkStyle } from './style';
import { menuItems } from '../../utils/constant';
import { logout } from '../../redux/globalAction';
import useFilteredMenuItems from '../../hooks/useFilteredMenuItems';

function MenuDrawer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user_details, permissions, isEmployee, selectedSection } = useSelector((state) => ({
    user_details: state?.userInfo?.data?.user_details,
    permissions: state?.userInfo?.data?.permissions,
    isEmployee: state?.userInfo?.isEmployee,
    selectedSection: state?.userInfo?.slectedResponseMenu
  }));

  const filteredMenuItems = useFilteredMenuItems(permissions, isEmployee, menuItems);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logout Successfully');
    navigate('/');
  };

  const handleSelection = (e) => dispatch(setSelectResponseMenu(e));

  return (
    <MenuWrapper>
      <HeaderSection>
        <div className="loggedUser">
          {user_details[0]?.admin_table_name || user_details[0]?.first_name}
        </div>
        <div onClick={handleLogout} className="logout">
          Logout
        </div>
      </HeaderSection>
      {filteredMenuItems?.map((list) => (
        <MenuList
          key={list?.id}
          checked={selectedSection === list?.id}
          onClick={() => handleSelection(list?.id)}>
          <LinkStyle to={list.path} state={{ project_id: user_details[0]?.id }}>
            {list?.name}
          </LinkStyle>
        </MenuList>
      ))}
    </MenuWrapper>
  );
}

export default MenuDrawer;
const MenuWrapper = styled.div`
  padding: 20px;
`;

const MenuList = styled.div`
  padding: 10px 20px;
  color: ${(props) => (props.checked ? `blue` : `black`)};
`;

const HeaderSection = styled.div`
  display: flex;
  padding: 5px 20px;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid grey;
  font-weight: 600;
  .logout {
    cursor: pointer;
  }
`;
