import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import NavBar from '../components/navbar/NavBar';
import SideBar from '../components/sidebar/SideBar';
import { useWindowWide } from '../utils/common_functions';
import colors from '../theme/colors';
import { ConfigProvider } from 'antd';
import { fontFamilys } from '../theme/common_style';
import { useSelector } from 'react-redux';

const MainContainer = styled(Box)({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  background: colors.gray90
});

const theme = {
  token: {
    fontFamily: fontFamilys.poppinsFont
  }
};

function Layout() {
  const largeScreen = useWindowWide(750);
  const isSidebarOpen = useSelector((state) => state?.sidebar?.isSidebarOpen);
  return (
    <ConfigProvider theme={theme}>
      <MainContainer>
        <NavBar />
        <Box sx={{ display: 'flex', flex: 1 }}>
          {largeScreen && <SideBar />}
          <ItemWrapper marginspace={largeScreen ? (isSidebarOpen ? '250px' : '80px') : '0px'}>
            <Outlet />
          </ItemWrapper>
        </Box>
      </MainContainer>
    </ConfigProvider>
  );
}

export default Layout;

const ItemWrapper = styled(Box)(({ marginspace }) => ({
  flex: 1,
  background: colors.gray90,
  padding: '0 24px 24px',
  marginTop: '12px',
  height: 'calc(100vh - 87px)',
  overflow: 'auto',
  marginLeft: marginspace, // '250px',
  '::-webkit-scrollbar': {
    display: 'none'
  }
}));
