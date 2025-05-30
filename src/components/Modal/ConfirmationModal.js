/* eslint-disable react/prop-types */
import styled from '@emotion/styled';
import { Button, Modal } from 'antd';
import React from 'react';

const ConfirmationModal = ({
  open,
  onCancel,
  title,
  description,
  onSubmit,
  icon,
  iconBG,
  loading
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      prefixCls="confirmation-modal"
      width={400}
      footer={null}>
      <ConfirmationModalStyled>
        {icon && (
          <div className="img" style={{ backgroundColor: iconBG }}>
            {icon}
          </div>
        )}
        <div className="title">
          <h4 style={{ textAlign: 'center' }}>{title}</h4>
          <p>{description}</p>
        </div>
        <div className="btns">
          <button style={{ cursor: 'pointer' }} onClick={onCancel}>
            No
          </button>
          <Button
            loading={loading}
            className="submit"
            style={{ background: iconBG }}
            onClick={onSubmit}>
            Yes
          </Button>
        </div>
      </ConfirmationModalStyled>
    </Modal>
  );
};

export default ConfirmationModal;

const ConfirmationModalStyled = styled.div`
  width: 100%;
  padding: 10px;

  .img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-bottom: 10px;
  }

  .title {
    display: flex;
    flex-direction: column;

    h4 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 24px;
      color: #0e0e0e;
      text-align: center;
      margin: 0;
    }
    p {
      margin: 0;
      font-family: Plus Jakarta Sans;
      font-weight: 400;
      font-size: 16px;
      text-align: center;
      color: #696969;
    }
  }
  .btns {
    width: 100%;
    display: flex;
    gap: 8px;
    margin-top: 20px;

    button {
      width: 100%;
      height: 42px;
      border: 1px solid #696969;
      border-radius: 10px;
      font-family: 'Plus Jakarta Sans';
      font-weight: 500;
      font-size: 14px;
      text-align: center;
      background: transparent;
    }
    .submit {
      border: none;
      color: #fff;

      &:hover {
        color: #fff !important;
      }
    }
  }
`;
