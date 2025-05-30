'use client';

import { useState } from 'react';
import { Input, Modal } from 'antd';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CloseOutlined,
  UserOutlined,
  MailOutlined,
  BankOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import AvatarImage from '../../components/common/AvatarImage';

const ViewBillingId = ({ open, onClose, viewData }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={650}
      footer={null}
      prefixCls="create-employees"
      closeIcon={false}>
      <CreateModalWrapper>
        <ModalCloseBox onClick={onClose}>
          <CloseOutlined />
        </ModalCloseBox>

        <ProfileCard>
          <ProfileHeader />

          <ProfileContent>
            <ProfileImageSection>
              <AvatarImage
                style={{ width: '200px', height: '200px', border: '4px solid white' }}
                image={process.env.REACT_APP_S3_BASE_URL + viewData?.profile_image}
                name={viewData?.name}
              />
              <Username>{viewData?.user_name || 'N/A'}</Username>
              <Badge>{viewData?.source_name}</Badge>
            </ProfileImageSection>

            <InfoGrid>
              <InfoRow icon={<UserOutlined />} label="Full Name" value={viewData?.name || 'N/A'} />
              <InfoRow
                icon={<LockOutlined />}
                label="Password"
                customValue={
                  <Input
                    readOnly
                    value={visible ? viewData?.password : '*'.repeat(viewData?.password?.length)}
                    type="text"
                    style={{
                      width: '70%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      paddingLeft: 0,
                      paddingRight: 0,
                      margin: '0 0 0 21px',
                      fontSize: '16px',
                      color: '#0e0e0e',
                      fontWeight: '600'
                    }}
                    suffix={
                      <span
                        onClick={() => setVisible((prev) => !prev)}
                        style={{ cursor: 'pointer' }}>
                        {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </span>
                    }
                  />
                }
              />
              <InfoRow
                icon={<MailOutlined />}
                label="Email"
                value={viewData?.email || 'N/A'}
                breakAll
              />
              <InfoRow
                icon={<SafetyCertificateOutlined />}
                label="MFA ID"
                value={viewData?.mfa_id || 'N/A'}
                breakAll
              />
              <InfoRow
                icon={<BankOutlined />}
                label="Source"
                value={viewData?.source_name || 'N/A'}
              />
              <InfoRow
                icon={<SecurityScanOutlined />}
                label="Security Code"
                value={viewData?.security_id || 'N/A'}
              />
            </InfoGrid>
          </ProfileContent>
        </ProfileCard>
      </CreateModalWrapper>
    </Modal>
  );
};

export default ViewBillingId;

ViewBillingId.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  viewData: PropTypes.object
};

const CreateModalWrapper = styled.div`
  position: relative;
  padding: 0;
`;

const ModalCloseBox = styled.div`
  position: absolute;
  right: -12px;
  top: -14px;
  cursor: pointer;
  width: 27px;
  height: 27px;
  background: #7c71ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  height: 80px;
  width: 100%;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 20px;
`;

const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -50px;
  margin-bottom: 20px;
`;

const Username = styled.div`
  font-size: 30px;
  font-weight: 600;
  margin-top: 10px;
`;

const Badge = styled.div`
  background-color: #f0e6ff;
  color: #8a3ffc;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  margin-top: 8px;
`;

const InfoGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const StyledInfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const Label = styled.div`
  font-size: 14px;
  color: #767676;
  font-weight: 500;
`;

const Value = styled.p`
  font-size: 16px;
  color: #0e0e0e;
  font-weight: 500;
  margin: 0 0 0 21px;
  word-break: ${({ breakAll }) => (breakAll ? 'break-all' : 'normal')};
`;

const InfoRow = ({ icon, label, value, customValue, breakAll = false }) => (
  <StyledInfoItem>
    <InfoHeader>
      {icon}
      <Label>{label}</Label>
    </InfoHeader>
    {customValue || <Value breakAll={breakAll}>{value || 'N/A'}</Value>}
  </StyledInfoItem>
);

InfoRow.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  customValue: PropTypes.node,
  breakAll: PropTypes.bool
};
