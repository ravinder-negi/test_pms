import styled from '@emotion/styled';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/4041.gif';
import { SunfocusLogo } from '../../theme/SvgIcons';

const Notfound = () => {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <NotFoundStyle>
      <div onClick={handleHomeClick} className="company-logo">
        <SunfocusLogo />
      </div>
      <div className="notFound">
        <div className="logo-main">
          <img src={logo} alt="" className="logo-style" />
        </div>
        <div className="text">The Page You Were Looking For Does Not Exist</div>
        <button onClick={handleHomeClick}>Go Home</button>
      </div>
    </NotFoundStyle>
  );
};

export default Notfound;
const NotFoundStyle = styled.div`
  height: 95vh;
  .notFound {
    background-color: white;
    color: blue;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90vh;
  }
  .logo-style {
    width: 100%;
    height: 100%;
  }
  .logo-main {
    width: 30%;
    min-width: 300px;
  }
  .company-logo {
    margin: 20px 0 0 20px;
    width: 200px;
    &:hover {
      cursor: pointer;
    }
  }
  button {
    margin-top: 20px;
    background-color: #fdc840;
    color: #1a7cc3;
    padding: 10px 20px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 800;
    font-size: 22px;
    text-align: start;
    line-height: 28px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darkorange;
      padding-left: 14px;
      padding-right: 26px;
    }

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      right: -10px;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 8px solid white;
      transition: width 0.3s ease;
    }

    &:hover::before {
      width: 28px;
    }
  }
  .text {
    color: black;
    font-family: Poppins;
    font-style: normal;
    font-weight: 800;
    font-size: 22px;
    text-align: start;
    line-height: 28px;
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    text-align: center;
  }
`;
