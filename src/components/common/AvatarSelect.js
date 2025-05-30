import { Select, Space, Tag } from 'antd';
import PropTypes from 'prop-types';
import { SmartAvatar } from './AvatarGroup';
import { DropdownIconNew } from '../../theme/SvgIcons';

const { Option } = Select;
const imgBaseUrl = process.env.REACT_APP_S3_BASE_URL;

const AvatarSelect = ({ value, onChange, options, placeholder, loading, imageEnd }) => (
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
    filterOption={(input, option) => option?.props?.searchLabel?.includes(input.toLowerCase())}>
    {options?.map((user, index) => {
      let url = imageEnd ? imgBaseUrl + imageEnd + user?.value : imgBaseUrl + user?.imgUrl;
      return (
        <Option
          key={index}
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
    })}
  </Select>
);

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
  imageEnd: PropTypes.string
};

const AvatarMultiSelect = ({
  value,
  onChange,
  options,
  placeholder,
  loading,
  maxTagCount = 1,
  maxCount,
  imageEnd
}) => {
  const tagRender = ({ label, value, closable, onClose, imgUrl }) => {
    let url = imageEnd ? imgBaseUrl + imageEnd + value : imgBaseUrl + imgUrl;
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
      filterOption={(input, option) => option?.props?.searchLabel?.includes(input.toLowerCase())}>
      {options?.map((user, index) => {
        let url = imageEnd ? imgBaseUrl + imageEnd + user?.value : imgBaseUrl + user?.imgUrl;
        return (
          <Option
            key={index}
            value={user?.value}
            searchLabel={user?.label?.toLowerCase()}
            label={user.label}>
            <Space>
              <SmartAvatar name={user?.label} baseUrl={url} />
              <span>{user?.label}</span>
            </Space>
          </Option>
        );
      })}
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
  imageEnd: PropTypes.string
};

export { AvatarSelect, AvatarMultiSelect };
