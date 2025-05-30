import React from 'react';
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

const InfoItem = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const Label = styled.span`
  font-size: 14px;
  color: #888;
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  word-break: break-all;
`;

const UserInfoModal = ({ visible, onClose, user }) => {
  const userInfo = user?.emp_id || '';
  const userFullName = getFullName(
    userInfo?.first_name,
    userInfo?.middle_name,
    userInfo?.last_name
  );
  const userImage =
    process.env.REACT_APP_S3_BASE_URL + 'employee/profileImg/' + userInfo?.id + '.jpg';
  console.log('src User Image:', userImage);

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
                  style={{ width: '135px', height: '135px' }}
                  image={userImage}
                  name={userFullName}
                />
                <input type="file" accept="image/*" style={{ display: 'none' }} />
              </div>
            }
          />
        </LeftPanel>
        <RightPanel>
          <InfoGrid>
            <InfoItem>
              <Label>Name:</Label>
              <Value>{userFullName}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Employee Code:</Label>
              <Value>{userInfo?.emp_code}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Email:</Label>
              <Value>{userInfo.email}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Personal Email:</Label>
              <Value>{userInfo.personal_email}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Contact Number:</Label>
              <Value>
                {formatPhone(userInfo?.contact_number_country_code, userInfo?.contact_number)}
              </Value>
            </InfoItem>
            <InfoItem>
              <Label>Emergency Number:</Label>
              <Value>
                {formatPhone(
                  userInfo?.emergency_contact_number_country_code,
                  userInfo?.emergency_contact_number
                )}
              </Value>
            </InfoItem>
            <InfoItem>
              <Label>WhatsApp Number:</Label>
              <Value>
                {formatPhone(userInfo?.whatsapp_number_country_code, userInfo?.whatsapp_number)}
              </Value>
            </InfoItem>
          </InfoGrid>
        </RightPanel>
      </Container>
    </StyledModal>
  );
};

export default UserInfoModal;

UserInfoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    emp_id: PropTypes.object
  }),
  emp_id: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    contact_number: PropTypes.string,
    emergency_contact_number: PropTypes.string,
    whatsapp_number: PropTypes.string,
    email: PropTypes.string,
    profile_completion: PropTypes.number,
    id: PropTypes.string,
    first_name: PropTypes.string,
    middle_name: PropTypes.string,
    last_name: PropTypes.string,
    contact_number_country_code: PropTypes.string,
    emergency_contact_number_country_code: PropTypes.string,
    whatsapp_number_country_code: PropTypes.string,
    emp_code: PropTypes.string,
    personal_email: PropTypes.string
  }).isRequired
};
