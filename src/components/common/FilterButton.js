import { Badge, Button } from 'antd';
import PropTypes from 'prop-types';
import { FilterIconNew } from '../../theme/SvgIcons';
import { useMemo } from 'react';

const FilterButton = ({ handleClick, appliedFilter }) => {
  let activeCount = useMemo(() => {
    let count = 0;
    for (const key in appliedFilter) {
      const value = appliedFilter[key];
      if (
        value !== null &&
        value !== undefined &&
        (typeof value !== 'object' ||
          (Array.isArray(value) && value.length > 0) ||
          Object.keys(value).length > 0) &&
        (typeof value !== 'string' || value.trim() !== '')
      ) {
        count++;
      }
    }

    return count;
  }, [appliedFilter]);

  return (
    <Badge count={activeCount} prefixCls="filterBadge">
      <Button prefixCls="custom-filter-btn" onClick={() => handleClick(true)}>
        <FilterIconNew /> Filter
      </Button>
    </Badge>
  );
};

export default FilterButton;

FilterButton.propTypes = {
  handleClick: PropTypes.func,
  appliedFilter: PropTypes.any
};
