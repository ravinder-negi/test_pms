import { Select, Space, Tag } from 'antd';
import PropTypes from 'prop-types';
import { SmartAvatar } from './AvatarGroup';
import { DropdownIconNew } from '../../theme/SvgIcons';
import { generateEmployeeImgUrl } from '../../utils/common_functions';

const { Option } = Select;

const AvatarSelect = ({ value, onChange, options, placeholder, loading, isEmp }) => {
  const renderOption = (user, isEmp) => {
    const url = isEmp
      ? generateEmployeeImgUrl(user?.value)
      : generateEmployeeImgUrl(user?.imgUrl, true);

    return (
      <Option
        key={user?.value}
        value={user?.value}
        searchLabel={user?.label?.toLowerCase()}
        label={
          <Space>
            <SmartAvatar name={user?.label} baseUrl={url} />
            <span>{user?.label}</span>
          </Space>
        }>
        <Space>
          <SmartAvatar name={user?.label} baseUrl={url} />
          <span>{user?.label}</span>
        </Space>
      </Option>
    );
  };

  return (
    <Select
      allowClear
      prefixCls="form-select"
      style={{ width: '100%' }}
      value={value}
      onChange={onChange}
      optionLabelProp="label"
      showSearch
      placeholder={placeholder}
      loading={loading}
      suffixIcon={<DropdownIconNew />}
      filterOption={(input, option) =>
        option?.props?.searchLabel?.toLowerCase().includes(input.toLowerCase())
      }>
      {options?.map((user) => renderOption(user, isEmp))}
    </Select>
  );
};

AvatarSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      avatar: PropTypes.string
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  isEmp: PropTypes.bool
};

AvatarSelect.defaultProps = {
  placeholder: 'Select an option',
  loading: false,
  isEmp: false
};

const AvatarMultiSelect = ({
  value,
  onChange,
  options,
  placeholder,
  loading,
  maxTagCount = 1,
  maxCount,
  isEmp
}) => {
  const tagRender = ({ label, value, closable, onClose, imgUrl }) => {
    const url = isEmp ? generateEmployeeImgUrl(value) : generateEmployeeImgUrl(imgUrl, true);

    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, display: 'flex', alignItems: 'center' }}>
        <Space size={4}>
          <SmartAvatar name={label} baseUrl={url} />
          {label}
        </Space>
      </Tag>
    );
  };

  const renderOption = (user, isEmp) => {
    const url = isEmp
      ? generateEmployeeImgUrl(user?.value)
      : generateEmployeeImgUrl(user?.imgUrl, true);

    return (
      <Option
        key={user?.value}
        value={user?.value}
        searchLabel={user?.label?.toLowerCase()}
        label={user.label}>
        <Space>
          <SmartAvatar name={user?.label} baseUrl={url} />
          <span>{user?.label}</span>
        </Space>
      </Option>
    );
  };

  return (
    <Select
      prefixCls="antMultipleSelector"
      mode="multiple"
      maxTagCount={maxTagCount}
      maxCount={maxCount}
      allowClear
      style={{ width: '100%' }}
      value={value}
      onChange={onChange}
      optionLabelProp="label"
      tagRender={tagRender}
      optionFilterProp="children"
      showSearch
      placeholder={placeholder}
      loading={loading}
      filterOption={(input, option) =>
        option?.props?.searchLabel?.toLowerCase().includes(input.toLowerCase())
      }>
      {options?.map((user) => renderOption(user, isEmp))}
    </Select>
  );
};

AvatarMultiSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      avatar: PropTypes.string
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  maxTagCount: PropTypes.number,
  maxCount: PropTypes.number,
  isEmp: PropTypes.bool
};

AvatarMultiSelect.defaultProps = {
  placeholder: 'Select options',
  loading: false,
  isEmp: false
};

export { AvatarSelect, AvatarMultiSelect };
