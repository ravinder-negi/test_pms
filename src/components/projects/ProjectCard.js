import styled from '@emotion/styled/macro';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const ProjectCard = ({ image, content, bg, loading }) => {
  return (
    <Card loading={loading} style={{ textAlign: 'left', width: '100%', height: '100%' }}>
      <ImageWrapper bg={bg}>{image}</ImageWrapper>
      {content}
    </Card>
  );
};

export default ProjectCard;

ProjectCard.propTypes = {
  image: PropTypes.element,
  content: PropTypes.element,
  bg: PropTypes.string,
  loading: PropTypes.bool
};

const ImageWrapper = styled.div`
  background-color: ${({ bg }) => bg};
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-bottom: 16px;
`;
