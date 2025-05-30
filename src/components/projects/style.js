import styled from '@emotion/styled';
import { Box, Button, Chip, Divider, Select, TextField } from '@mui/material';
import colors from '../../theme/colors';
import { fontFamilys } from '../../theme/common_style';

export const ContainerStyle = styled(Box)({
  background: colors.gray90
});

export const labelStyle = (color = colors.black, fontSize = '22px', fontWeight = 400) => {
  const style = {
    fontFamily: fontFamilys.poppinsFont,
    fontStyle: 'normal',
    fontWeight,
    fontSize,
    textAlign: 'start',
    color,
    lineHeight: '22px'
  };
  return style;
};

export const FieldStyle = styled(TextField)({
  width: '100%',
  // maxWidth: '450px',
  marginTop: '21px',
  // height: '42px',
  '& .MuiOutlinedInput-input': {
    padding: '7px 10px'
  },
  '& .MuiInputBase-input': {
    height: '26px'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: `1px solid ${colors.grayLight}`,
      borderRadius: '6px'
      // height: '47px'
    },
    '&:hover fieldset': {
      border: `1px solid ${colors.grayLight}`
    }
  }
});

export const SelectStyle = styled(Select)({
  height: 40,
  width: '162px',
  background: colors.white,
  '& .MuiSvgIcon-root': {
    color: colors.blackDark
  }
});

export const DividerStyle = styled(Divider)({
  border: `1px solid ${colors.gray92}`,
  height: '51px',
  marginLeft: '45px',
  marginRight: '45px'
});

export const BoxWrapper = styled(Box)(({ justifyContent }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '30px',
  flexWrap: 'wrap',
  justifyContent: `${justifyContent ? justifyContent : 'space-between'}`
}));

export const BoxWrap = styled(Box)(({ spaceBetween, padding }) => ({
  background: colors.white,
  padding: padding || '0px 40px 0px 10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: spaceBetween || 'end',
  height: '66px'
}));

export const ButtonStyle = styled(Button)({
  background: colors.darkSkyBlue,
  width: '122px',
  height: '43px',
  color: colors.white,
  marginRight: '25px'
});

export const FormFieldStyle = styled(TextField)(({ hasError }) => ({
  background: colors.white,
  border: `1px solid ${hasError ? colors.redError : colors.Gray90}`,
  borderRadius: '4px',
  height: '47px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '0px',
      borderRadius: '6px'
    },
    '& input': {
      padding: '12px'
    }
  }
}));

export const TextArea = styled(FormFieldStyle)({
  width: '100%',
  maxHeight: '100px',
  height: '103px'
});

export const Wrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

export const CustomArea = styled.textarea`
  border: 1px solid ${colors.gray93};
  border-radius: 6px;
  width: 100%;
  min-height: 100px;
  padding: ${(props) => (props.padding ? props.padding : '10px')};
  // caret-color: transparent;
  font-weight: 400;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  // font-family: ${fontFamilys.poppinsFont}!important
  font-size: 16px;
  line-height: 1.4375em;
  background: ${colors.white};
  ::placeholder {
    color: ${colors.grayLight};
    // padding: 12px 17px;
  }
`;

export const ChipStyle = styled(Chip)(({ bg }) => ({
  borderRadius: '6px',
  background: bg,
  color: colors.white,
  fontWeight: 500,
  fontSize: '14px',
  marginRight: '10px'
}));

export const SpinnerStyle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '100px'
});
