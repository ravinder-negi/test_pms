import React from 'react';
import dayjs from 'dayjs';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';
import Title from 'antd/es/typography/Title';
import AvatarImage from '../../components/common/AvatarImage';
import { DarkText, FlexWrapper, GreyText } from '../../theme/common_style';
import { Description, getFullName } from '../../utils/common_functions';
import { notificationActiveTabEnums, notificationSendToEnums } from '../../utils/constant';
import { useSelector } from 'react-redux';

const NotificationInfoModal = ({ open, onCancel, data }) => {
  const image_end = 'employee/profileImg/';
  const activeTab = useSelector((state) => state?.NotificationSlice?.NotificationTab);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      prefixCls="antCustomModal"
      width={600}
      footer={null}>
      <Title level={4} style={{ margin: 0 }}>
        Notification info
      </Title>
      <FlexWrapper gap="10px" justify="start" margin="20px 0" width="100%" wrap="nowrap">
        {activeTab === notificationActiveTabEnums.NOTIFICATIONS ? (
          <FlexWrapper direction="column" width="50%" align="start" gap="3px">
            <GreyText>Sent By</GreyText>
            <FlexWrapper gap="6px">
              <AvatarImage
                style={{
                  height: '32px',
                  width: '32px',
                  minWidth: '32px',
                  fontSize: '16px',
                  border: '1px solid #fff'
                }}
                image={`${
                  process.env.REACT_APP_S3_BASE_URL + image_end + data?.created_by?.id
                }.jpg`}
                name={
                  getFullName(
                    data?.created_by?.first_name,
                    data?.created_by?.middle_name,
                    data?.created_by?.last_name
                  ) || data?.created_by
                }
              />
              <DarkText>
                {getFullName(
                  data?.created_by?.first_name,
                  data?.created_by?.middle_name,
                  data?.created_by?.last_name
                ) || data?.created_by}
              </DarkText>
            </FlexWrapper>
          </FlexWrapper>
        ) : (
          <FlexWrapper direction="column" width="50%" align="start" gap="3px">
            <GreyText>Title</GreyText>
            <DarkText>{data?.title}</DarkText>
          </FlexWrapper>
        )}
        <FlexWrapper direction="column" width="50%" align="start" gap="3px">
          <GreyText>Notification Date & Time</GreyText>
          {data?.created_at && (
            <DarkText>
              {dayjs(data?.created_at)?.format('DD MMM, YYYY')} at{' '}
              {dayjs(data?.created_at)?.format('hh:mm a')?.toUpperCase()}
            </DarkText>
          )}
        </FlexWrapper>
      </FlexWrapper>
      {activeTab === notificationActiveTabEnums.NOTIFICATIONS && (
        <FlexWrapper direction="column" width="100%" align="start" gap="3px">
          <GreyText>Title</GreyText>
          <DarkText>{data?.title}</DarkText>
        </FlexWrapper>
      )}
      <FlexWrapper direction="column" align="start" gap="6px" margin="20px 0">
        <GreyText>Description</GreyText>
        <div
          style={{
            border: '1px solid #C8C8C8',
            padding: '10px',
            borderRadius: '8px',
            width: '100%',
            minHeight: '140px'
          }}>
          <Description htmlString={data?.description} />
        </div>
      </FlexWrapper>
      {activeTab !== notificationActiveTabEnums.NOTIFICATIONS && (
        <FlexWrapper direction="column" align="start" gap="3px" width="100%">
          <GreyText>Sent to</GreyText>
          <FlexWrapper gap="6px" width="100%" justify="start">
            {data?.sendTo === notificationSendToEnums.ALL ? (
              <StyledTag>All</StyledTag>
            ) : data?.sendTo === notificationSendToEnums.DEPARTMENT ? (
              data?.departments?.map((item, index) => (
                <StyledTag key={index}>{item?.departments}</StyledTag>
              ))
            ) : (
              data?.sendTo === notificationSendToEnums.EMPLOYEE &&
              data?.employees?.map((item, index) => (
                <StyledTag key={index}>
                  {getFullName(item?.first_name, item?.middle_name, item?.last_name)}
                </StyledTag>
              ))
            )}
          </FlexWrapper>
        </FlexWrapper>
      )}
    </Modal>
  );
};

NotificationInfoModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  data: PropTypes.object
};

export default NotificationInfoModal;

const StyledTag = styled.div`
  background-color: #f3f6fc;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
`;
