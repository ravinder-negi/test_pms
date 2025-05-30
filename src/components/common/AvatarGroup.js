import { Avatar, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { avatarColors } from '../../utils/constant';
import { FlexWrapper } from '../../theme/common_style';
import { getColorForProfileCompletion } from '../../utils/common_functions';

const checkExtension = (baseUrl, extensionType, defaultExtension) => {
  if (!baseUrl) return null;
  return extensionType.some((ext) => baseUrl.endsWith(ext))
    ? baseUrl
    : `${baseUrl}.${defaultExtension}`;
};

const useAvatarLogic = (baseUrl, extensionType, defaultExtension) => {
  const [isImageError, setIsImageError] = useState(false);
  const [bgColor, setBgColor] = useState('');
  const src = checkExtension(baseUrl, extensionType, defaultExtension);

  useEffect(() => {
    setBgColor(avatarColors[Math.floor(Math.random() * avatarColors.length)]);
    setIsImageError(false);
  }, [src]);

  return { src, isImageError, bgColor, setIsImageError };
};

const Style = {
  height: '36px',
  width: '36px',
  fontSize: '18px',
  border: '1px solid #fff',
  color: '#fff',
  fontWeight: 'bold',
  textTransform: 'capitalize'
};

const pTag = {
  margin: 0,
  fontSize: '12px',
  textTransform: 'capitalize'
};

const MAX_VISIBLE = 4;
const extensionType = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const defaultExtension = 'jpg';

// AvatarGroup component to display a group of avatars with overflow count
export const AvatarGroup = ({ avatars }) => {
  const visibleAvatars = avatars?.slice(0, MAX_VISIBLE);
  const overflowCount = avatars?.length - MAX_VISIBLE;

  return (
    <div className="avatar-group">
      {visibleAvatars?.map((user) => (
        <GroupComp
          key={user?.id}
          name={user?.name}
          baseUrl={user?.src}
          completionColor={
            user?.completionColor && getColorForProfileCompletion(user?.completionColor)
          }
        />
      ))}
      {overflowCount > 0 && (
        <Avatar size="14px" className="avatar-group-item avatar-overflow">
          +{overflowCount}
        </Avatar>
      )}
    </div>
  );
};

AvatarGroup.propTypes = {
  avatars: PropTypes.array
};

const GroupComp = ({ name, baseUrl, completionColor }) => {
  const { src, isImageError, bgColor, setIsImageError } = useAvatarLogic(
    baseUrl,
    extensionType,
    defaultExtension
  );

  return (
    <Tooltip title={name} color={bgColor} styles={{ body: { borderRadius: '100px' } }}>
      <div className="avatar-tooltip-wrapper">
        <Avatar
          style={{
            ...Style,
            backgroundColor: isImageError ? bgColor : 'none',
            border: completionColor ? `2px solid ${completionColor}` : '1px solid #fff'
          }}
          src={!isImageError ? src : undefined}
          onError={() => {
            setIsImageError(true);
            return true;
          }}>
          {name?.charAt(0) || '?'}
        </Avatar>
      </div>
    </Tooltip>
  );
};

GroupComp.propTypes = {
  name: PropTypes.string,
  baseUrl: PropTypes.string,
  completionColor: PropTypes.string
};

// Used to show avatar in select
export const SmartAvatar = ({ name, baseUrl, size = '14px' }) => {
  const { src, isImageError, bgColor, setIsImageError } = useAvatarLogic(
    baseUrl,
    extensionType,
    defaultExtension
  );

  return (
    <Avatar
      src={!isImageError ? src : undefined}
      size={size}
      style={isImageError ? { backgroundColor: bgColor, color: '#fff' } : {}}
      onError={() => {
        setIsImageError(true);
        return true;
      }}
      className="avatar-group-item">
      {name?.charAt(0) || '?'}
    </Avatar>
  );
};

SmartAvatar.propTypes = {
  name: PropTypes.string,
  baseUrl: PropTypes.string,
  size: PropTypes.string
};

// Single Avatar with tooltip
export const AvatarGroupRow = ({ name, role, baseUrl }) => {
  const { src, isImageError, bgColor, setIsImageError } = useAvatarLogic(
    baseUrl,
    extensionType,
    defaultExtension
  );

  return (
    <Tooltip
      arrow={false}
      color={bgColor}
      styles={{ body: { borderRadius: '100px' } }}
      title={
        <FlexWrapper gap="6px">
          <Avatar
            style={{
              ...Style,
              backgroundColor: isImageError ? bgColor : 'transparent'
            }}
            src={!isImageError ? src : undefined}>
            {name?.charAt(0) || '?'}
          </Avatar>
          <FlexWrapper direction="column" align="start">
            <p style={{ ...pTag, fontWeight: 600 }}>{name}</p>
            <p style={pTag}>{role}</p>
          </FlexWrapper>
        </FlexWrapper>
      }>
      <Avatar
        style={{
          ...Style,
          backgroundColor: isImageError ? bgColor : 'none'
        }}
        src={!isImageError ? src : undefined}
        onError={() => {
          setIsImageError(true);
          return true;
        }}>
        {name?.charAt(0) || '?'}
      </Avatar>
    </Tooltip>
  );
};

AvatarGroupRow.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string,
  baseUrl: PropTypes.string
};
