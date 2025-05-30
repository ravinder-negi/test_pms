import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import DefaultProfile from '../../assets/DefaultProfile.jpg';
import PropTypes from 'prop-types';

const AvatarImage = ({ style = {}, image = '', name = '', preview = false }) => {
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    if (preview) {
      setBgImage(image);
    } else if (image) {
      const img = new Image();
      img.src = image;

      img.onload = () => setBgImage(image);
      img.onerror = () => setBgImage('');
    }
  }, [image, preview]);

  const backgroundImage = bgImage || (!name && DefaultProfile) || '';

  return (
    <AvatarImageBox style={style} image={preview ? preview : backgroundImage}>
      {!bgImage && name && name.charAt(0).toUpperCase()}
    </AvatarImageBox>
  );
};

export default AvatarImage;

AvatarImage.propTypes = {
  style: PropTypes.object,
  image: PropTypes.string,
  name: PropTypes.string,
  preview: PropTypes.any
};

const AvatarImageBox = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: white;
  background-color: #7c71ff;
  overflow: hidden;
  background-image: ${({ image }) => (image ? `url(${image})` : 'none')};
  background-size: cover;
  background-position: center;
`;
