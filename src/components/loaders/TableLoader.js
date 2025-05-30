/* eslint-disable import/no-extraneous-dependencies */
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

// eslint-disable-next-line react/prop-types
const TableLoader = ({ size }) => {
  return (
    <Spin
      indicator={<LoadingOutlined spin style={{ fontSize: size, color: '#7c71ff' }} />}
      size="small"
    />
  );
};

export default TableLoader;
