import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Divider } from 'antd';
import dayjs from 'dayjs';
import Tag from '../../components/common/Tag';
import CreateReport from './CreateReport';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import { DeleteIcon, EditIcon, TrashIconNew } from '../../theme/SvgIcons';
import { checkPermission, currentModule, Description } from '../../utils/common_functions';
import { deleteReportApi } from '../../services/api_collection';
import { actionTypeEnums, reportingDonePoints } from '../../utils/constant';
import {
  DarkText,
  DeleteIconBox,
  EditIconBox,
  FlexWrapper,
  PurpleText
} from '../../theme/common_style';

const ReportingCard = ({ report, handleGetList, empName, showActions = true }) => {
  const navigate = useNavigate();
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const { isEmployee } = useSelector((e) => e.userInfo);
  let permissionSection = currentModule();
  const canUpdate = checkPermission(permissionSection, actionTypeEnums.UPDATE, permissions);
  const canDelete = checkPermission(permissionSection, actionTypeEnums.DELETE, permissions);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      let res = await deleteReportApi(report?.id);
      if (res?.statusCode === 200) {
        setDeleteModal(false);
        navigate('/reporting');
        toast.success(res?.message || 'Successfully deleted');
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <ContentWrapper>
      {editModal && (
        <CreateReport
          open={editModal}
          onCancel={() => setEditModal(false)}
          editDetails={report}
          handleList={handleGetList}
        />
      )}
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Report'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this Report?'}
          iconBG={'red'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      <FlexWrapper
        direction="column"
        align="start"
        width="100%"
        justify="start"
        gap="18px"
        cursor="default">
        <div style={{ width: '100%' }}>
          <FlexWrapper justify="space-between" width="100%" gap="6px" cursor="default">
            <div>
              <span
                onClick={() => {
                  navigate(`/project/details/${report?.project?.id}`, {
                    state: { project: report?.project }
                  });
                }}
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  fontFamily: 'Plus Jakarta Sans',
                  textAlign: 'left',
                  display: 'block',
                  cursor: 'pointer'
                }}>
                {empName || report?.project?.name}{' '}
                {!dayjs(report?.created_at).isSame(dayjs(report?.updated_at)) && (
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'Plus Jakarta Sans',
                      textAlign: 'left',
                      marginLeft: '4px'
                    }}>
                    (Edited)
                  </span>
                )}
              </span>
              <PurpleText style={{ textAlign: 'left' }}>
                {dayjs(report?.reporting_date || report?.created_at).format('ddd, DD MMM, YYYY')}
              </PurpleText>
            </div>
            {isEmployee && showActions ? (
              <FlexWrapper gap="6px">
                {dayjs(report?.created_at).isSame(dayjs(), 'day') && canUpdate && (
                  <EditIconBox
                    canUpdate={dayjs(report?.created_at).isSame(dayjs(), 'day') && canUpdate}
                    onClick={() =>
                      dayjs(report?.created_at).isSame(dayjs(), 'day') && setEditModal(true)
                    }>
                    <EditIcon />
                  </EditIconBox>
                )}
                {dayjs(report?.created_at).isSame(dayjs(), 'day') && canDelete && (
                  <DeleteIconBox
                    canDelete={dayjs(report?.created_at).isSame(dayjs(), 'day') && canDelete}
                    onClick={() =>
                      dayjs(report?.created_at).isSame(dayjs(), 'day') && setDeleteModal(true)
                    }>
                    <DeleteIcon />
                  </DeleteIconBox>
                )}
              </FlexWrapper>
            ) : (
              report?.billable &&
              report?.billable_hours && (
                <Tag.primary
                  style={{
                    padding: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '12px'
                  }}>
                  Billing: {report?.billable_hours} Hrs
                </Tag.primary>
              )
            )}
          </FlexWrapper>
          <Divider style={{ borderColor: '#F1F1F1', margin: '10px 0 0', borderWidth: '1.5px' }} />
        </div>
        <DarkText size="15px" style={{ textAlign: 'left' }}>
          <Description htmlString={report?.description} />
        </DarkText>
        {showActions && report?.billable && report?.billable_hours && isEmployee && (
          <Tag.primary
            style={{ padding: '8px', fontSize: '14px', fontWeight: '500', borderRadius: '12px' }}>
            Billing: {report?.billable_hours} Hrs
          </Tag.primary>
        )}
      </FlexWrapper>
      <FlexWrapper
        cursor="default"
        direction="column"
        gap="10px"
        justify="start"
        align="start"
        style={{
          minWidth: '30%',
          width: 'max-content',
          backgroundColor: '#F3F6FC',
          borderRadius: '12px',
          padding: '16px'
        }}>
        <span style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Plus Jakarta Sans' }}>
          Done Points
        </span>
        {reportingDonePoints?.map((option, i) => (
          <FlexWrapper
            key={i}
            completed={(report?.checklists || [])?.includes(option)}
            gap="6px"
            align="flex-start"
            justify="flex-start"
            cursor="default"
            wrap="nowrap">
            <input
              type="checkbox"
              checked={(report?.checklists || [])?.includes(option)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#7C71FF',
                cursor: 'default'
              }}
            />
            <span
              style={{
                textAlign: 'start',
                fontSize: '15px',
                fontFamily: 'Plus Jakarta Sans'
              }}>
              {option}
            </span>
          </FlexWrapper>
        ))}
      </FlexWrapper>
    </ContentWrapper>
  );
};

const ContentWrapper = styled(FlexWrapper)`
  align-items: unset;
  flex-wrap: nowrap;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  gap: 20px;
  cursor: default;
  width: 100%;
`;

ReportingCard.propTypes = {
  report: PropTypes.object.isRequired,
  handleGetList: PropTypes.func,
  empName: PropTypes.string,
  showActions: PropTypes.bool
};
export default ReportingCard;
