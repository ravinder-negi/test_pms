import React, { useMemo } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import AvatarImage from './AvatarImage';
import CircularProgressBar from './CircularProgress';
import { formatPhone, getFullName } from '../../utils/common_functions';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
    background-color: #f9fbff;
  }
`;

const Container = styled.div`
  display: flex;
  gap: 24px;
  padding: 24px 24px;
  background: white;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
  }
`;

const LeftPanel = styled.div`
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: baseline;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RightPanel = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  h3 {
    margin: 0;
  }
`;

const SectionTitle = styled.h3`
  font-weight: 600;
  margin: 12px 0;
  text-align: center;
  font-size: 24px;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = ({ label, value }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
    <span style={{ fontSize: '14px', color: '#888' }}>{label}</span>
    <span style={{ fontSize: '14px', fontWeight: '500', color: '#333', wordBreak: 'break-all' }}>
      {value}
    </span>
  </div>
);

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired
};

const UserInfoModal = ({ visible, onClose, user }) => {
  const userInfo = useMemo(() => user?.emp_id || {}, [user]);
  const userFullName = useMemo(
    () => getFullName(userInfo?.first_name, userInfo?.middle_name, userInfo?.last_name),
    [userInfo]
  );
  const userImage = useMemo(
    () => `${process.env.REACT_APP_S3_BASE_URL}employee/profileImg/${userInfo?.id || ''}.jpg`,
    [userInfo]
  );

  return (
    <StyledModal open={visible} onCancel={onClose} footer={null} width={700}>
      <SectionTitle>Basic Info</SectionTitle>
      <Container>
        <LeftPanel>
          <CircularProgressBar
            progress={userInfo?.profile_completion || 0}
            component={
              <div className="profile-img">
                <AvatarImage
                  image={userImage}
                  name={userFullName}
                  style={{ width: '135px', height: '135px' }}
                />
                <input type="file" accept="image/*" style={{ display: 'none' }} />
              </div>
            }
          />
        </LeftPanel>
        <RightPanel>
          <InfoGrid>
            <InfoItem label="Name:" value={userFullName} />
            <InfoItem label="Employee Code:" value={userInfo?.emp_code} />
            <InfoItem label="Email:" value={userInfo?.email} />
            <InfoItem label="Personal Email:" value={userInfo?.personal_email} />
            <InfoItem
              label="Contact Number:"
              value={formatPhone(userInfo?.contact_number_country_code, userInfo?.contact_number)}
            />
            <InfoItem
              label="Emergency Number:"
              value={formatPhone(
                userInfo?.emergency_contact_number_country_code,
                userInfo?.emergency_contact_number
              )}
            />
            <InfoItem
              label="WhatsApp Number:"
              value={formatPhone(userInfo?.whatsapp_number_country_code, userInfo?.whatsapp_number)}
            />
          </InfoGrid>
        </RightPanel>
      </Container>
    </StyledModal>
  );
};

UserInfoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    emp_id: PropTypes.shape({
      id: PropTypes.string,
      first_name: PropTypes.string,
      middle_name: PropTypes.string,
      last_name: PropTypes.string,
      emp_code: PropTypes.string,
      email: PropTypes.string,
      personal_email: PropTypes.string,
      contact_number: PropTypes.string,
      contact_number_country_code: PropTypes.string,
      emergency_contact_number: PropTypes.string,
      emergency_contact_number_country_code: PropTypes.string,
      whatsapp_number: PropTypes.string,
      whatsapp_number_country_code: PropTypes.string,
      profile_completion: PropTypes.number
    })
  })
};

export default UserInfoModal;
