import React from 'react';
import DetailsBox from './DetailsBox';
import PropTypes from 'prop-types';

const ProcurementInfo = ({ data, handleEdit, loading }) => {
  const fromattedData = [
    { key: 'Purchase Date', value: data?.purchase_date || 'N/A' },
    { key: 'Vendor Name', value: data?.vendor_name || 'N/A' },
    { key: 'Invoice Number', value: data?.invoice_number || 'N/A' }
  ];

  return (
    <DetailsBox
      heading={'Procurement Info'}
      cols={3}
      data={fromattedData}
      handleEdit={handleEdit}
      loading={loading}
    />
  );
};

ProcurementInfo.propTypes = {
  data: PropTypes.object,
  handleEdit: PropTypes.func,
  loading: PropTypes.bool
};

export default ProcurementInfo;
