import React from 'react';
import PropTypes from 'prop-types';
import { FlexWrapper } from '../../theme/common_style';

const EmptyData = ({ height, icon, title, subTitle }) => {
  return (
    <FlexWrapper direction="column" gap="12px" style={{ height }}>
      {icon}
      <FlexWrapper direction="column">
        <div style={{ fontWeight: '600', fontSize: '20px', fontFamily: 'Plus Jakarta Sans' }}>
          {title}
        </div>
        <div style={{ fontFamily: 'Plus Jakarta Sans' }}>{subTitle}</div>
      </FlexWrapper>
    </FlexWrapper>
  );
};

EmptyData.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.node,
  title: PropTypes.string,
  subTitle: PropTypes.string
};

export default EmptyData;
