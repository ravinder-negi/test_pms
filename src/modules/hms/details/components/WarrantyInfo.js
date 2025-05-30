import React from 'react';
import DetailsBox from './DetailsBox';
import PropTypes from 'prop-types';

const WarrantyInfo = ({ data, handleEdit, loading }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };
  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === '') return '';
    const num = Number(value);
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  const fromattedData = [
    { key: 'Start Date', value: formatDate(data?.warranty_start_date) },
    { key: 'End Date', value: formatDate(data?.warranty_end_date) },
    { key: 'Purchase Cost', value: formatCurrency(data?.purchase_cost) }
  ];

  return (
    <DetailsBox
      heading={'Warranty Info'}
      cols={3}
      data={fromattedData}
      handleEdit={handleEdit}
      loading={loading}
    />
  );
};

WarrantyInfo.propTypes = {
  data: PropTypes.object,
  handleEdit: PropTypes.func,
  loading: PropTypes.bool
};

export default WarrantyInfo;
