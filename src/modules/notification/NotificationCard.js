import styled from '@emotion/styled/macro';
import React, { useState } from 'react';
import Title from 'antd/es/typography/Title';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { DeleteIcon, EditIcon, TrashIconNew } from '../../theme/SvgIcons';
import { DeleteNotificationApi } from '../../redux/notification/apiRoute';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import AvatarImage from '../../components/common/AvatarImage';
import NotificationInfoModal from './NotificationInfoModal';
import SendNotification from './SendNotification';
import {
  checkPermission,
  ClampedDescription,
  currentModule,
  getFullName,
  getTimeAgo
} from '../../utils/common_functions';
import {
  DeleteIconBox,
  EditIconBox,
  EllipsisText,
  FlexWrapper,
  PurpleText
} from '../../theme/common_style';
import { actionTypeEnums, notificationActiveTabEnums } from '../../utils/constant';

const NotificationCard = ({ dataItem, fetchData }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const activeTab = useSelector((state) => state?.NotificationSlice?.NotificationTab);
  const [infoModal, setInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  let permissionSection = currentModule();
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const canUpdate = checkPermission(permissionSection, actionTypeEnums.UPDATE, permissions);
  const canDelete = checkPermission(permissionSection, actionTypeEnums.DELETE, permissions);
  const image_end = 'employee/profileImg/';

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await DeleteNotificationApi(dataItem?.id);
      if (res.statusCode === 200) {
        toast.success(res?.message);
        setDeleteModal(false);
        fetchData();
      } else {
        toast.warning(res?.message);
      }
    } catch (errorInfo) {
      console.log(errorInfo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {editModal && (
        <SendNotification
          open={editModal}
          onCancel={() => setEditModal(false)}
          fetchData={fetchData}
          editData={dataItem}
          editId={dataItem?.id}
        />
      )}
      <FlexWrapper direction="column" align="start" gap="16px" justify="start" width="100%">
        {activeTab === notificationActiveTabEnums.NOTIFICATIONS ? (
          <FlexWrapper gap="8px" justify="start" width="100%">
            <AvatarImage
              style={{
                height: '44px',
                width: '44px',
                minWidth: '44px',
                fontSize: '16px',
                border: '1px solid #fff'
              }}
              image={`${
                process.env.REACT_APP_S3_BASE_URL + image_end + dataItem?.created_by?.id
              }.jpg`}
              name={
                getFullName(
                  dataItem?.created_by?.first_name,
                  dataItem?.created_by?.middle_name,
                  dataItem?.created_by?.last_name
                ) || dataItem?.created_by
              }
            />
            <EllipsisText width="180px">
              <FlexWrapper direction="column" align="start">
                <Title
                  level={5}
                  style={{
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                  }}>
                  {getFullName(
                    dataItem?.created_by?.first_name,
                    dataItem?.created_by?.middle_name,
                    dataItem?.created_by?.last_name
                  ) ||
                    dataItem?.created_by ||
                    'N/A'}
                </Title>
                {dataItem?.created_at && (
                  <GreyText size="13px" style={{ fontWeight: 500 }}>
                    {getTimeAgo(dataItem?.created_at)} ago
                  </GreyText>
                )}
              </FlexWrapper>
            </EllipsisText>
          </FlexWrapper>
        ) : (
          <FlexWrapper justify="space-between" gap="6px" width="100%" margin="0 0 6px">
            <FlexWrapper direction="column" gap="2px" align="start">
              <Title level={5} style={{ margin: 0 }}>
                <EllipsisText width="170px">{dataItem?.title}</EllipsisText>
              </Title>
              {dataItem?.created_at && (
                <BlueText>
                  {dayjs(dataItem?.created_at).format('DD MMM, YYYY')} at{' '}
                  {dayjs(dataItem?.created_at).format('HH:MM a')?.toUpperCase()}
                </BlueText>
              )}
            </FlexWrapper>
            <FlexWrapper gap="6px">
              {activeTab === notificationActiveTabEnums.DRAFTS && canUpdate && (
                <EditIconBox
                  canUpdate={activeTab === notificationActiveTabEnums.DRAFTS}
                  onClick={() => setEditModal(true)}>
                  <EditIcon />
                </EditIconBox>
              )}
              {activeTab !== notificationActiveTabEnums.NOTIFICATIONS && canDelete && (
                <DeleteIconBox canDelete={true} onClick={() => setDeleteModal(true)}>
                  <DeleteIcon />
                </DeleteIconBox>
              )}
            </FlexWrapper>
          </FlexWrapper>
        )}
        <div>
          {activeTab === notificationActiveTabEnums.NOTIFICATIONS && (
            <Title level={5} style={{ margin: '0 0 2px' }}>
              {dataItem?.title}
            </Title>
          )}
          <GreyText>
            <ClampedDescription htmlString={dataItem?.description} />
          </GreyText>
        </div>
      </FlexWrapper>
      <PurpleText size="16px" onClick={() => setInfoModal(true)} style={{ cursor: 'pointer' }}>
        See Full Details
      </PurpleText>
      <ConfirmationModal
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        title={'Delete Notification'}
        onSubmit={handleDelete}
        buttonName={'Delete'}
        description={`Are you sure you want to delete this notification? ${
          activeTab === notificationActiveTabEnums.SENT
            ? 'This will remove the notification for all users who received it.'
            : ''
        }`}
        iconBG={'#FB4A49'}
        icon={<TrashIconNew />}
        loading={loading}
      />
      <NotificationInfoModal
        data={dataItem}
        open={infoModal}
        activeTab={activeTab}
        onCancel={() => setInfoModal(false)}
      />
    </Card>
  );
};

export default NotificationCard;

NotificationCard.propTypes = {
  dataItem: PropTypes.object,
  fetchData: PropTypes.func
};

const Card = styled(FlexWrapper)`
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  flex-direction: column;
  gap: 18px;
  align-items: flex-start;
  justify-content: space-between;
  text-align: left;
`;

const BlueText = styled.span`
  color: #65beee;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans';
`;

const GreyText = styled.span`
  color: #767676;
  font-size: 14px !important;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans';
  margin: 0 !important;

  * {
    font-size: 14px !important;
    font-weight: 500;
    font-family: 'Plus Jakarta Sans';
    margin: 0 !important;
  }
`;
