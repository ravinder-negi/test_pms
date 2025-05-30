'use client';

import { useMemo, useState } from 'react';
import { Input, Modal } from 'antd';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { GridBox } from '../../theme/common_style';
import Title from 'antd/es/typography/Title';
import dayjs from 'dayjs';
import { decryptToken } from '../../utils/common_functions';

const SubAdminDetails = ({ open, onClose, viewData }) => {
  const [visible, setVisible] = useState(false);

  const password = useMemo(
    () => decryptToken(viewData?.account_password),
    [viewData?.account_password]
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={650}
      footer={null}
      prefixCls="antCustomModal">
      <div>
        <Title level={3} style={{ margin: '10px 0 30px', textAlign: 'center' }}>
          Sub Admin Info
        </Title>
        <GridBox cols={2} style={{ margin: '10px 0' }}>
          <InfoRow
            icon={<MailOutlined />}
            label="Email"
            value={viewData?.account_email || 'sfs.gursewak@gmail.com'}
            breakAll
          />
          <InfoRow
            icon={<LockOutlined />}
            label="Password"
            customValue={
              <Input
                readOnly
                value={visible ? password : '*'.repeat(password?.length)}
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
                  <span onClick={() => setVisible((prev) => !prev)} style={{ cursor: 'pointer' }}>
                    {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </span>
                }
              />
            }
          />

          <InfoRow icon={<UserOutlined />} label="Role" value={viewData?.role_role || 'N/A'} />
          <InfoRow
            icon={<SafetyCertificateOutlined />}
            label="Created at"
            value={
              viewData?.account_created_at
                ? dayjs(viewData?.account_created_at)?.format('DD MMM, YYYY')
                : 'N/A'
            }
            breakAll
          />
        </GridBox>
      </div>
    </Modal>
  );
};

export default SubAdminDetails;

SubAdminDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  viewData: PropTypes.object
};

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
