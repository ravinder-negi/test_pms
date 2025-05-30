import { Avatar, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { avatarColors } from '../../utils/constant';
import { FlexWrapper } from '../../theme/common_style';

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
const extension = 'jpg';
const extensionType = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

const AvatarGroup = ({ avatars, completionColor }) => {
  const visibleAvatars = avatars?.slice(0, MAX_VISIBLE);
  const overflowCount = avatars?.length - MAX_VISIBLE;

  return (
    <div className="avatar-group">
      {visibleAvatars?.map((user, index) => (
        <GroupComp
          key={index}
          name={user?.name}
          baseUrl={user?.src}
          completionColor={completionColor}
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

export default AvatarGroup;

AvatarGroup.propTypes = {
  avatars: PropTypes.array,
  completionColor: PropTypes.any
};

const GroupComp = ({ name, baseUrl, completionColor }) => {
  const [isImageError, setIsImageError] = useState(false);
  const [bgColor, setBgColor] = useState('');

  const checkExtension = (baseUrl) => {
    for (let i = 0; i < extensionType.length; i++) {
      if (baseUrl?.endsWith(extensionType[i])) {
        return extensionType[i];
      }
    }
  };

  const src = checkExtension(baseUrl) ? baseUrl : `${baseUrl}.${extension}`;

  useEffect(() => {
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    setBgColor(randomColor);
    setIsImageError(false);
  }, [src]);

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
  baseUrl: PropTypes.any,
  completionColor: PropTypes.any
};

export const SmartAvatar = ({ name, baseUrl, size = '14px' }) => {
  const [isImageError, setIsImageError] = useState(false);
  const [bgColor, setBgColor] = useState('');

  const checkExtension = (baseUrl) => {
    for (let i = 0; i < extensionType.length; i++) {
      if (baseUrl?.endsWith(extensionType[i])) {
        return extensionType[i];
      }
    }
  };

  const src = checkExtension(baseUrl) ? baseUrl : `${baseUrl}.${extension}`;

  useEffect(() => {
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    setBgColor(randomColor);
  }, [src]);

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
  baseUrl: PropTypes.any,
  size: PropTypes.any
};

export const AvatarGroupRow = ({ name, role, baseUrl }) => {
  const [isImageError, setIsImageError] = useState(false);
  const [bgColor, setBgColor] = useState('');
  const src = `${baseUrl}.${extension}`;

  useEffect(() => {
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    setBgColor(randomColor);
  }, [src]);

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
      <>
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
      </>
    </Tooltip>
  );
};

AvatarGroupRow.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string,
  baseUrl: PropTypes.any
};
