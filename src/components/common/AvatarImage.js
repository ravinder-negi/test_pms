/* eslint-disable react/prop-types */
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import DefaultProfile from '../../assets/DefaultProfile.jpg';

const AvatarImage = ({ style, image, name, preview }) => {
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    if (preview) {
      setBgImage(image);
    } else {
      const img = new Image();
      img.src = image;

      img.onload = () => {
        setBgImage(image);
      };
      img.onerror = () => {
        setBgImage('');
      };
    }
  }, [image, name]);

  const backgroundImage = () => {
    if (name === false && !bgImage) {
      return DefaultProfile;
    } else if (bgImage) {
      return bgImage;
    } else {
      return '';
    }
  };

  return (
    <AvatarImageBox style={style} image={preview ? preview : backgroundImage()}>
      {!bgImage && name ? name.charAt(0).toUpperCase() : null}
    </AvatarImageBox>
  );
};

export default AvatarImage;

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
