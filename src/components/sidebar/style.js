import styled from '@emotion/styled';
import { Box, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import colors from '../../theme/colors';

export const SidebarBox = styled(Box)`
  background: ${colors.white};
  position: fixed;
  overflow-x: auto;
  width: ${({ isSidebarOpen }) => (isSidebarOpen ? '250px' : '80px')};
  padding: ${({ isSidebarOpen }) => (isSidebarOpen ? '0px 20px' : '0px 15px')};
  transition: width 0.1s ease-in-out, padding 0.1s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 75px);

  ul {
    padding-top: 0px;
  }

  .close-sidebar-btn {
    width: 100%;
    height: 48px;
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &::-webkit-scrollbar {
    width: 1px; /* Width of the scrollbar */
  }
`;

export const ListItemStyle = styled(ListItem)({
  width: ({ isSidebarOpen }) => (isSidebarOpen ? '100%' : '80px'),
  color: colors.grayLight,
  fontFamily: 'Plus Jakarta Sans',
  fontWeight: 500,
  fontSize: '14px',
  margin: '2px 0px',
  '& span': {
    marginLeft: '14px',
    fontFamily: 'Plus Jakarta Sans'
  },

  '&.active, &:hover, &.active:hover': {
    background: '#7C71FF',
    color: colors.white,
    borderRadius: '8px',
    '& path': {
      fill: colors.white
    }
  }
});

export const LinkStyle = styled(Link)(({ display }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: display && display,
  fontFamily: 'Plus Jakarta Sans'
}));

export const LogoutBox = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
  cursor: pointer;

  h4 {
    margin: 0;
    font-family: Plus Jakarta Sans;
    font-weight: 500;
    font-size: 14px;
    color: #fb4a49;
  }
`;
