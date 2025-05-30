import styled from '@emotion/styled';
import { Box, Chip, IconButton, TextField } from '@mui/material';
import colors from '../../theme/colors';

export const NavBoxStyle = styled(Box)({
  // width: 'calc(100% - 220px)',
  height: '75px',
  background: colors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: '20px',
  '& .MuiChip-label': {
    textTransform: 'capitalize'
  }
});

export const FieldStyle = styled(TextField)({
  background: colors.grayLight91,
  marginLeft: '15px',
  width: '100%',
  borderRadius: '6px',
  '& .MuiOutlinedInput-input': {
    background: colors.grayLight91,
    color: colors.grayLight,
    marginLeft: '15px',
    padding: '10px'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '0px',
      borderRadius: '6px'
    },
    '&:hover fieldset': {
      border: '1px'
    },
    '&.Mui-focused fieldset': {
      border: '1px'
    }
  }
});

export const AvatarBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  paddingTop: '22px',
  paddingBottom: '22px',
  borderBottom: `1px solid ${colors.grayLight91}`,
  marginLeft: '25px',
  marginRight: '45px',
  width: '192px',
  position: 'relative'
});

export const ToogleLogo = styled.div`
  position: absolute;
  right: -42px;
  width: 26px;
  height: 26px;
  background: #7c71ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  rotate: ${({ isSidebarOpen }) => !isSidebarOpen && '180deg'};
`;

export const IconButtonStyle = styled(IconButton)({
  width: '44px',
  height: '44px',
  background: '#F1F1F1'
  // marginRight: '20px'
});

export const MenuBox = styled(Box)({
  background: colors.white,
  height: '48px',
  borderRadius: '40px',
  display: 'flex',
  alignItems: 'center',
  padding: '4px 17px 4px 4px',
  cursor: 'pointer',
  border: '1px solid #E3E3E3'
});

export const ChipStyle = styled(Chip)({
  height: '20px',
  background: colors.darkGreen
});

export const ChipWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  marginLeft: '10px',
  marginRight: '17px'
});

export const Heading = styled.h2`
  font-family: 'Plus Jakarta Sans';
  font-weight: 700;
  font-size: 24px;
  margin-left: 20px;
  user-select: none;
  white-space: nowrap;

  @media (max-width: 850px) {
    font-size: 17px;
  }
`;
