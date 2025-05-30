/* eslint-disable react/prop-types */
// CircularProgressBar.js
import styled from '@emotion/styled';
import React from 'react';

const SIZE = 160; // width & height
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const Wrapper = styled.div`
  position: relative;
  width: ${SIZE}px;
  height: ${SIZE}px;
`;

const Circle = styled.svg`
  transform: rotate(90deg);
  width: 100%;
  height: 100%;
`;

const BackgroundCircle = styled.circle`
  fill: none;
  stroke: #eee;
  stroke-width: ${STROKE_WIDTH};
`;

const ProgressCircle = styled.circle`
  fill: none;
  stroke: ${({ percentage }) =>
    percentage === 100 ? '#4CAF50' : percentage <= 50 ? 'red' : '#FFC023'};
  stroke-width: ${STROKE_WIDTH};
  stroke-linecap: round;
  stroke-dasharray: ${CIRCUMFERENCE};
  stroke-dashoffset: ${({ progressOffset }) => progressOffset};
  transition: stroke-dashoffset 0.35s;
`;

const PercentageText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: -12px;
  left: 12px;
  width: 134px;
  height: 38px;
  align-items: center;
  border-radius: 48px;
  background-color: ${({ percentage }) =>
    percentage === 100 ? '#4CAF50' : percentage <= 50 ? 'red' : '#FFC023'};

  p {
    font-family: 'Inter' !important;
    font-weight: 600 !important;
    font-size: 12px !important;
    margin: 0 !important;
    color: #ffffff;
  }
`;

const CircularProgressBar = ({ progress, component }) => {
  const progressOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <Wrapper>
      <Circle>
        <BackgroundCircle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} />
        <ProgressCircle
          percentage={progress}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          progressOffset={progressOffset}
        />
      </Circle>
      <PercentageText>{component}</PercentageText>
      <ButtonBox percentage={progress}>
        <p>{progress}% COMPLETE</p>
      </ButtonBox>
    </Wrapper>
  );
};

export default CircularProgressBar;
