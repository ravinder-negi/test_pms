import styled from '@emotion/styled';
import { SearchIconNew } from '../../theme/SvgIcons';
import { CloseCircleFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';

const SearchField = ({ style, placeholder, onChange, value, allowClear = true }) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <SearchFieldStyled>
      <span className="search-icon">
        <SearchIconNew />
      </span>
      <input
        type="text"
        style={style}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e?.target?.value)}
      />
      {allowClear && value && (
        <ClearButton onClick={handleClear}>
          <CloseCircleFilled
            style={{
              cursor: 'pointer',
              color: 'rgba(0, 0, 0, 0.25)',
              width: '12px',
              height: '12px'
            }}
          />
        </ClearButton>
      )}
    </SearchFieldStyled>
  );
};

export default SearchField;

SearchField.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  allowClear: PropTypes.bool
};

const ClearButton = styled.span`
  position: absolute;
  right: 12px;
  top: 10px;
`;

const SearchFieldStyled = styled.div`
  position: relative;

  .search-icon {
    position: absolute;
    left: 12px;
    top: 10px;
  }

  .clear-icon {
    position: absolute;
    right: 12px;
    top: 13px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }
  }

  input {
    width: 100%;
    max-width: 300px;
    height: 40px;
    border-radius: 10px;
    background: #ffffff;
    padding-left: 38px;
    padding-right: ${(props) => (props.value ? '32px' : '12px')};
    border: none;

    &:focus {
      outline: none;
    }
  }
`;
