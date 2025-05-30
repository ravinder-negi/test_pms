import PropTypes from 'prop-types';
import React from 'react';
import DetailsBox from './DetailsBox';

const DeviceSpecification = ({ data, handleEdit, loading }) => {
  const fromattedData = [
    { key: 'CPU', value: data?.cpu },
    { key: 'RAM', value: data?.ram },
    { key: 'Storage', value: data?.storage },
    { key: 'Graphics', value: data?.graphics },
    { key: 'Operating System', value: data?.operating_system },
    { key: 'MAC Address', value: data?.macORip_address },
    { key: 'Username', value: data?.user_name },
    { key: 'Password', value: data?.password }
  ];

  return (
    <DetailsBox
      heading={'Specification'}
      cols={3}
      data={fromattedData}
      handleEdit={handleEdit}
      loading={loading}
    />
  );
};

DeviceSpecification.propTypes = {
  data: PropTypes.object,
  handleEdit: PropTypes.func,
  loading: PropTypes.bool
};

export default DeviceSpecification;
