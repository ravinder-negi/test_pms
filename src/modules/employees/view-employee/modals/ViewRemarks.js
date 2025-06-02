/* eslint-disable react/prop-types */
import React from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { ModalCloseIcon } from '../../../../theme/SvgIcons';
import { Modal } from 'antd';
import styled from '@emotion/styled';
import moment from 'moment';

const ViewRemarks = ({ open, onClose, editDetails }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="create-employees"
      width={482}
      centered
      closeIcon={false}
      footer={null}>
      <ModalCloseBox onClick={onClose}>
        <ModalCloseIcon />
      </ModalCloseBox>
      <ContentWrapper>
        <div className="name">
          <h5>{editDetails?.title}</h5>
          <p>{moment(editDetails?.created_at).format('DD MMM, YYYY')}</p>
        </div>
        <div className="remarks">
          <p>{editDetails?.remarks}</p>
        </div>
      </ContentWrapper>
    </Modal>
  );
};

export default ViewRemarks;

const ContentWrapper = styled.div`
  width: 100%;
  padding: 16px;
  min-height: 300px;

  .name {
    h5 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 18px;
      color: #111111;
      margin: 0;
      text-align: left;
    }
    p {
      font-family: 'Plus Jakarta Sans';
      font-weight: 600;
      font-size: 14px;
      color: #7c71ff;
      margin: 0;
      text-align: left;
      margin-top: 4px;
    }
  }
  .remarks {
    margin-top: 16px;
    p {
      font-family: 'Plus Jakarta Sans';
      font-weight: 400;
      font-size: 16px;
      margin: 0;
      color: #111111;
      white-space: pre-wrap;
    }
  }
`;
