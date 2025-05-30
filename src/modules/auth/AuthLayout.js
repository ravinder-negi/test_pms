import React from 'react';
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import signBg from '../../assets/BACKGROUND.svg';
import { SunfocusLogo } from '../../theme/SvgIcons';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <Wrapper>
      <div className="left-section">
        <img src={signBg} alt="background" className="bgImage" />
      </div>
      <BoxWrapper>
        <div className="logo">
          <SunfocusLogo />
        </div>
        <Outlet />
      </BoxWrapper>
    </Wrapper>
  );
};

export default AuthLayout;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;

  .left-section {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bgImage {
    height: 100vh;
    @media (max-width: 1100px) {
      display: none !important;
    }
  }

  .logo {
    width: 100%;
    text-align: right;

    @media (max-width: 450px) {
      text-align: center;
    }
  }

  .buttonStyle {
    width: 100%;
    background-color: #7c71ff;
    color: #fff;
    text-transform: capitalize;
    height: 50px;
    margin-top: 20px;
    &:hover {
      background-color: rgb(149, 140, 250) !important;
    }
  }
`;

const BoxWrapper = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  padding: 2rem;
`;

export const CardStyle = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 450px;
  padding: 2rem;
  gap: 20px;

  @media (max-width: 450px) {
    width: 400px;
  }

  @media (max-width: 350px) {
    width: 380px;
  }
`;
