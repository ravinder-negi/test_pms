import React from 'react';
import DetailsBox from './DetailsBox';
import PropTypes from 'prop-types';

const BasicInfo = ({ data, handleEdit, loading }) => {
  const fromattedData = [
    { key: 'Device Name', value: data?.device_id },
    { key: 'Device Type', value: data?.device_type },
    { key: 'Brand', value: data?.brand },
    { key: 'Model', value: data?.model },
    { key: 'Serial Number', value: data?.serial_number }
  ];

  return (
    <DetailsBox
      loading={loading}
      heading={'Basic Info'}
      cols={5}
      data={fromattedData}
      handleEdit={handleEdit}
    />
  );
};

BasicInfo.propTypes = {
  data: PropTypes.object,
  handleEdit: PropTypes.func,
  loading: PropTypes.bool
};

export default BasicInfo;
