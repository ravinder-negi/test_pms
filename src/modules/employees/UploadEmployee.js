/* eslint-disable react/prop-types */
import styled from '@emotion/styled';
import { Button, Modal, Upload } from 'antd';
import React from 'react';
import { ModalCloseBox } from './EmployeesStyle';
import { ModalCloseIcon, UploadDocumentIcon } from '../../theme/SvgIcons';
import { FlexWrapper } from '../../theme/common_style';
const { Dragger } = Upload;

const UploadEmployee = ({ open, onClose }) => {
  const uploadProps = {
    name: 'file',
    accept: '.xls,.xlsx',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        alert('Only Excel files are allowed!');
        return Upload.LIST_IGNORE;
      }
      if (file.size / 1024 / 1024 > 25) {
        alert('File must be smaller than 25MB!');
        return Upload.LIST_IGNORE;
      }
      return true;
    }
  };

  return (
    <Modal
      open={open}
      width={376}
      onCancel={onClose}
      prefixCls="create-employees"
      closeIcon={false}
      centered
      footer={null}>
      <UploadModalWrapper>
        <ModalCloseBox onClick={onClose}>
          <ModalCloseIcon />
        </ModalCloseBox>
        <div className="title">
          <h2>Upload Employee List</h2>
        </div>
        <Dragger
          {...uploadProps}
          style={{
            border: '2px dashed #ccc',
            padding: 20,
            borderRadius: 8,
            background: '#ffffff',
            marginTop: '25px'
          }}>
          <UploadDocumentIcon />
          <p className="upload-title">Upload accept excel only</p>
          <p className="upload-size">(Max. File size: 25 MB)</p>
        </Dragger>
        <FlexWrapper justify={'end'}>
          <Button prefixCls="antCustomBtn" style={{ width: '140px', marginTop: '15px' }}>
            Add
          </Button>
        </FlexWrapper>
      </UploadModalWrapper>
    </Modal>
  );
};

export default UploadEmployee;

const UploadModalWrapper = styled.div`
  width: 100%;
  padding: 20px;
  position: relative;
  background: #ffffff;
  border-radius: 20px;

  .title {
    width: 100%;
    display: flex;
    justify-content: center;

    h2 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 24px;
      color: #0e0e0e;
      text-align: center;
      margin: 0;
    }
  }
  .upload-title {
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 14px;
    color: #7c71ff;
    margin: 0;
    margin-top: 8px;
  }
  .upload-size {
    font-family: 'Plus Jakarta Sans';
    font-weight: 400;
    font-size: 12px;
    text-align: center;
    color: #111111;
    margin: 0;
    margin-top: 5px;
  }
`;
