import React from 'react';
import PropTypes from 'prop-types';
import { ApplyDate, FlexWrapper, NoStyleButton, Title } from '../../theme/common_style';
import { ViewIconNew } from '../../theme/SvgIcons';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from 'antd';
import { getCategory, getSlot, getStatusTag } from '../../utils/common_functions';

const EmployeeCard = ({ item, loading }) => {
  const navigate = useNavigate();

  return (
    <FlexWrapper
      gap="10px"
      cursor="default"
      style={{
        padding: '24px',
        borderRadius: '12px',
        backgroundColor: '#ffffff'
      }}>
      {!loading ? (
        <>
          <FlexWrapper justify="space-between" width="100%" cursor="default">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Title>{item.leave_type}</Title>
              <ApplyDate>
                <span style={{ fontWeight: '700' }}>Apply Date: </span>
                {item.created_at?.split('T')[0]}
              </ApplyDate>
            </div>
            {getStatusTag(item.status)}
          </FlexWrapper>
          <FlexWrapper justify="space-between" width="100%" cursor="default">
            <FlexWrapper align="flex-start" gap="2px" direction={'column'} cursor="default">
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#9F9F9F',
                  lineHeight: '150%'
                }}>
                Start Date
              </div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '16px',
                  fontWeight: '400',
                  color: '#0E0E0E',
                  lineHeight: '150%'
                }}>
                {item?.start_date}
              </div>
            </FlexWrapper>
            <FlexWrapper align="flex-start" gap="2px" direction={'column'} cursor="default">
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#9F9F9F',
                  lineHeight: '150%'
                }}>
                End Date
              </div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '16px',
                  fontWeight: '400',
                  color: '#0E0E0E',
                  lineHeight: '150%'
                }}>
                {item?.end_date}
              </div>
            </FlexWrapper>
            <FlexWrapper align="flex-start" gap="2px" direction={'column'} cursor="default">
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#9F9F9F',
                  lineHeight: '150%'
                }}>
                Leave Category
              </div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '16px',
                  fontWeight: '400',
                  color: '#0E0E0E',
                  lineHeight: '150%'
                }}>
                {getCategory(item?.leave_category) ?? 'N/A'}
              </div>
            </FlexWrapper>
            <FlexWrapper align="flex-start" gap="2px" direction={'column'} cursor="default">
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#9F9F9F',
                  lineHeight: '150%'
                }}>
                Leave Slot
              </div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '16px',
                  fontWeight: '400',
                  color: '#0E0E0E',
                  lineHeight: '150%'
                }}>
                {getSlot(item?.leave_slot) ?? 'N/A'}
              </div>
            </FlexWrapper>
            <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor={'default'}>
              <NoStyleButton
                onClick={() => {
                  navigate(`/lms/details/${item.id}`, {
                    state: { lms: item }
                  });
                }}>
                <FlexWrapper
                  style={{
                    backgroundColor: '#7C71FF',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%'
                  }}>
                  <ViewIconNew />
                </FlexWrapper>
              </NoStyleButton>
            </FlexWrapper>
          </FlexWrapper>
        </>
      ) : (
        <Skeleton active paragraph={{ rows: 3 }} title={false} />
      )}
    </FlexWrapper>
  );
};

EmployeeCard.propTypes = {
  item: PropTypes.shape({
    emp_id: PropTypes.string.isRequired,
    emp_name: PropTypes.string.isRequired,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    leave_category: PropTypes.string.isRequired,
    leave_slot: PropTypes.string.isRequired,
    quota: PropTypes.string.isRequired,
    hr: PropTypes.array,
    reporting: PropTypes.array,
    id: PropTypes.string.isRequired,
    leave_type: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired
  }).isRequired,
  loading: PropTypes.bool
};

export default EmployeeCard;
