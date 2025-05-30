import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const TableLoader = ({ size }) => {
  return (
    <Spin
      indicator={<LoadingOutlined spin style={{ fontSize: size, color: '#7c71ff' }} />}
      size="small"
    />
  );
};

export default TableLoader;

TableLoader.propTypes = {
  size: PropTypes.string
};
