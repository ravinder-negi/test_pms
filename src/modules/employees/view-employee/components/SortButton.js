'use client';
import { Dropdown, Button } from 'antd';
import { DownOutlined, CloseCircleFilled } from '@ant-design/icons';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

// Styled button
const SortButton = styled(Button)`
  background-color: #fff;
  height: 40px;
  border-radius: 8px;
  padding: 6px 12px;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

// Arrow button (up/down)
const Arrow = styled.div`
  width: 0;
  height: 0;
  margin: 2px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

const UpArrow = styled(Arrow)`
  border-bottom: 7px solid ${({ active }) => (active ? 'blue' : '#999')};
`;

const DownArrow = styled(Arrow)`
  border-top: 7px solid ${({ active }) => (active ? 'blue' : '#999')};
`;

const SortIcon = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 4px;
`;

const ClearButton = styled.span`
  color: rgba(0, 0, 0, 0.25);
  font-size: 12px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: rgba(0, 0, 0, 0.45);
  }
`;

const SortByDropdown = ({
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  sortOptions,
  allowClear = false
}) => {
  const handleMenuClick = ({ key }) => {
    if (key === sortField) {
      setSortField(null);
      setSortOrder(null);
    } else {
      setSortField(key);
      // setSortOrder(null);
    }
  };

  const handleSort = (direction) => {
    if (!sortField) return;
    setSortOrder(direction);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSortField(null);
    setSortOrder(null);
  };

  const menuProps = {
    items: sortOptions.map(({ label, value }) => ({
      key: value,
      label
    })),
    onClick: handleMenuClick,
    selectedKeys: [sortField]
  };

  return (
    <Dropdown menu={menuProps} trigger={['click']}>
      <SortButton>
        <SortIcon>
          <UpArrow
            disabled={!sortField}
            active={sortOrder === 'asc'}
            onClick={(e) => {
              e.stopPropagation();
              handleSort('asc');
            }}
          />
          <DownArrow
            disabled={!sortField}
            active={sortOrder === 'desc'}
            onClick={(e) => {
              e.stopPropagation();
              handleSort('desc');
            }}
          />
        </SortIcon>
        Sort By {sortField ? `${sortOptions.find((o) => o.value === sortField)?.label}` : ''}
        {allowClear && sortField ? (
          <ClearButton onClick={handleClear}>
            <CloseCircleFilled />
          </ClearButton>
        ) : (
          <DownOutlined style={{ marginLeft: 'auto' }} />
        )}
      </SortButton>
    </Dropdown>
  );
};

export default SortByDropdown;

SortByDropdown.propTypes = {
  sortField: PropTypes.string,
  sortOrder: PropTypes.string,
  setSortField: PropTypes.func,
  setSortOrder: PropTypes.func,
  sortOptions: PropTypes.array,
  allowClear: PropTypes.bool
};
