import styled from '@emotion/styled';
import React from 'react';
import { NoDataIconNew } from '../../theme/SvgIcons';
import { Button } from 'antd';
import PropTypes from 'prop-types';

const NoData = ({ height, title, subTitle, buttonText, handleBtn, img }) => {
  return (
    <NoDataStyle height={height}>
      <div>{img ? img : <NoDataIconNew />}</div>
      {title && <h5>{title}</h5>}
      {subTitle && <p>{subTitle}</p>}
      {handleBtn && (
        <Button
          style={{ minWidth: '140px', marginTop: 12 }}
          className="antCustomBtn"
          onClick={handleBtn}>
          {buttonText}
        </Button>
      )}
    </NoDataStyle>
  );
};

export default NoData;

NoData.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  subTitle: PropTypes.string,
  buttonText: PropTypes.string,
  handleBtn: PropTypes.func,
  img: PropTypes.node
};

const NoDataStyle = styled.div`
  width: 100%;
  height: ${({ height }) => height || '100%'};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h5 {
    font-family: 'Plus Jakarta Sans';
    font-weight: 600;
    font-size: 20px;
    color: #212121;
    margin: 0;
    margin-top: 10px;
  }

  p {
    font-family: 'Plus Jakarta Sans';
    font-weight: 400;
    font-size: 16px;
    text-align: center;
    color: #0e0e0e;
    margin: 0;
    margin-top: 3px;
  }
`;
