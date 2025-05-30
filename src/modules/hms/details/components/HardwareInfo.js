import React, { useEffect, useState } from 'react';
import BasicInfo from './BasicInfo';
import { FlexWrapper, GreyText } from '../../../../theme/common_style';
import ProcurementInfo from './ProcurementInfo';
import WarrantyInfo from './WarrantyInfo';
import DeviceSpecification from './DeviceSpecification';
import PropTypes from 'prop-types';
import AddModal from '../../AddModal';
import Title from 'antd/es/typography/Title';
import { ContentWrapper, getStatusTag } from '../../common';
import { getDeviceDetails } from '../../../../services/api_collection';
import { toast } from 'react-toastify';
import {
  devicesContainSpecification,
  hmsSectionEnum,
  hmsStatusEnum
} from '../../../../utils/constant';
import { useSelector } from 'react-redux';

const HardwareInfo = ({ data }) => {
  const [editModal, setEditModal] = useState(false);
  const activeTab = useSelector((state) => state?.HmsSlice?.HmsTab);
  const [editing, setEditing] = useState('');
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (editing) => {
    setEditing(editing);
    setEditModal(true);
  };

  const handleGetDeviceDetails = async () => {
    setLoading(true);
    let res = await getDeviceDetails(data?.id);
    if (res?.statusCode === 200) {
      setDeviceDetails(res?.data);
      setLoading(false);
    } else {
      setDeviceDetails(null);
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetDeviceDetails();
  }, [data?.id]);

  return (
    <div>
      {editModal && editing && (
        <AddModal
          editing={editing}
          activeTab={activeTab}
          open={editModal}
          onClose={() => {
            setEditModal(false);
          }}
          handleGetDeviceListing={handleGetDeviceDetails}
          data={deviceDetails}
        />
      )}
      <FlexWrapper justify="space-between" margin="8px 0 12px">
        <Title level={4} style={{ margin: 0 }}>
          Hardware Info
        </Title>
        {getStatusTag(deviceDetails?.status)}
      </FlexWrapper>
      <BasicInfo
        loading={loading}
        data={deviceDetails}
        handleEdit={() => handleEdit(hmsSectionEnum?.BASIC_INFO)}
      />
      <FlexWrapper width="100%" gap="10px" wrap="nowrap" align="unset">
        <ProcurementInfo
          loading={loading}
          data={deviceDetails}
          handleEdit={() => handleEdit(hmsSectionEnum?.PROCUREMENT_INFO)}
        />
        <WarrantyInfo
          loading={loading}
          data={deviceDetails}
          handleEdit={() => handleEdit(hmsSectionEnum?.WARRANTY_INFO)}
        />
      </FlexWrapper>
      {devicesContainSpecification?.includes(deviceDetails?.device_type) && (
        <DeviceSpecification
          loading={loading}
          data={deviceDetails}
          handleEdit={() => handleEdit(hmsSectionEnum?.SPECIFICATIONS)}
        />
      )}
      {deviceDetails?.device_status === hmsStatusEnum?.RETIRED && (
        <ContentWrapper style={{ marginTop: '14px', textAlign: 'left' }}>
          <Title level={5} style={{ margin: '0 0 16px' }}>
            Decommission Date: 25 Apr, 2025
          </Title>
          <GreyText size="14px">
            Risus nec tortor odio magna accumsan donec lacus natoque. Lobortis rhoncus suspendisse
            scelerisque adipiscing pellentesque tempus ullamcorper feugiat. Orci phasellus ornare
            nisi proin et aliquam sagittis lorem morbi. Metus tristique quam dictum mauris molestie
            sed convallis lectus est. Cursus risus ac viverra faucibus facilisis
          </GreyText>
        </ContentWrapper>
      )}
    </div>
  );
};

HardwareInfo.propTypes = {
  data: PropTypes.object
};

export default HardwareInfo;
