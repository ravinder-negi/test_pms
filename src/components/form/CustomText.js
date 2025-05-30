import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { fontFamilys } from '../../theme/common_style';

const CustomText = (props) => {
  const { children, variant, sx } = props;
  let style = {
    fontFamily: fontFamilys.poppinsFont,
    width: '100%',
    textAlign: 'left'
  };
  return (
    <Typography
      sx={{ ...style, ...sx }}
      component={'p'}
      variant={variant ? variant : 'body1_medium'}>
      {children}
    </Typography>
  );
};

CustomText.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
  sx: PropTypes.object
};
export default CustomText;
