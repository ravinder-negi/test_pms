import styled from '@emotion/styled/macro';
import PropTypes from 'prop-types';
import { FlexWrapper } from '../../theme/common_style';

const TagComponent = ({ type, children, ...props }) => {
  const colors = {
    info: { color: '#0177DB', bg: '#E1E7FF' },
    warning: { color: '#FFC023', bg: '#FFF3DB' },
    success: { color: '#5EB85C', bg: '#FAFFDE' },
    danger: { color: '#FB4A49', bg: '#FFDEE6' },
    default: { color: 'white', bg: '#7C71FF' },
    primary: { color: 'white', bg: '#65BEEE' },
    grey: { color: 'black', bg: '#F6F6F6' }
  };

  return (
    <StyledTag
      color={colors[type]?.color}
      bg={colors[type]?.bg}
      gap="10px"
      width="fit-content"
      {...props}>
      {children}
    </StyledTag>
  );
};

TagComponent.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.node
};

const Tag = (props) => <TagComponent {...props} />;

Tag.info = (props) => <TagComponent type="info" {...props} />;
Tag.warning = (props) => <TagComponent type="warning" {...props} />;
Tag.success = (props) => <TagComponent type="success" {...props} />;
Tag.danger = (props) => <TagComponent type="danger" {...props} />;
Tag.default = (props) => <TagComponent type="default" {...props} />;
Tag.primary = (props) => <TagComponent type="primary" {...props} />;
Tag.grey = (props) => <TagComponent type="grey" {...props} />;

export default Tag;

const StyledTag = styled(FlexWrapper)`
  background-color: ${({ bg }) => bg};
  color: ${({ color }) => color};
  padding: 6px 12px;
  white-space: nowrap;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans';
`;
