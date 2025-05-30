import Drawer from '@mui/material/Drawer';
import PropTypes from 'prop-types';

import * as React from 'react';
import colors from '../../theme/colors';
import { useWindowWide } from '../../utils/common_functions';

const CustomDrawer = (props) => {
  const { open, setOpen, children, maxWidth, overflow } = props;
  const largeScreen = useWindowWide(650);
  return (
    <Drawer
      sx={{
        '& .MuiPaper-root': {
          background: colors.ghostWhite,
          minWidth: largeScreen ? 600 : '70%',
          maxWidth: maxWidth || 700,
          overflow: overflow && overflow
        }
      }}
      anchor={'right'}
      open={open}
      onClose={() => setOpen()}>
      {children}
    </Drawer>
  );
};

export default CustomDrawer;
CustomDrawer.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  children: PropTypes.func,
  minWidth: PropTypes.string,
  maxWidth: PropTypes.string,
  overflow: PropTypes.string
};
