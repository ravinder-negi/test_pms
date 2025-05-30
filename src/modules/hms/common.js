import styled from '@emotion/styled/macro';
import Tag from '../../components/common/Tag';

export const getStatusTag = (status, cursor = 'default') => {
  const statusStyles = {
    maintainance: 'warning',
    available: 'success',
    retired: 'danger',
    assigned: 'info'
  };
  const tagVariant = statusStyles[status] || 'default';
  const TagVariant = Tag[tagVariant];

  return <TagVariant style={{ cursor: cursor, textTransform: 'capitalize' }}>{status}</TagVariant>;
};

export const ContentWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: ${({ padding }) => padding || '24px 16px'};
`;

export const CustomBtn = styled.button`
  border: none;
  border-radius: 10px;
  padding: 8px 20px;
  font-family: Plus Jakarta Sans;
  text-transform: capitalize;
  font-weight: 600;
  cursor: pointer;
  background-color: ${({ status }) =>
    status === 'Assigned' ? '#FFC023' : status === 'Maintainance' ? '#5EB85C' : 'red'};
  color: ${({ status }) =>
    status === 'Assigned' ? '#0E0E0E' : status === 'Maintainance' ? '#FFFFFF' : 'white'};
`;
