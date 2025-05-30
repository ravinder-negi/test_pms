/* eslint-disable react/prop-types */
import styled from '@emotion/styled';
import { Button, Modal, Upload } from 'antd';
import React, { useRef, useState } from 'react';
import { ModalCloseIcon, UploadDocumentIcon } from '../../../../theme/SvgIcons';
import { FlexWrapper } from '../../../../theme/common_style';
import { ModalCloseBox } from '../../EmployeesStyle';
import { toast } from 'react-toastify';
import uploadFileToS3 from '../../../../utils/uploadS3Bucket';
import { useParams } from 'react-router-dom';
import { addEmployeeDocumentApi } from '../../../../redux/employee/apiRoute';
import { fileTypesArray } from '../../../../utils/constant';
import { formatFileSize } from '../../../../utils/common_functions';

const { Dragger } = Upload;

const AddDocument = ({ open, onClose, handleDocGet = null, collectionId = null, apiPath }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const uploadData = useRef(null);
  const { id } = useParams();

  const uploadProps = {
    name: 'file',
    accept: '.pdf,.jpg,.jpeg,.png,.webp,.xls,.xlsx',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      const isAllowed = allowedTypes.includes(file.type);

      if (!isAllowed) {
        alert('Only PDF, image, and Excel files are allowed!');
        return Upload.LIST_IGNORE;
      }

      if (file.size / 1024 / 1024 > 25) {
        alert('File must be smaller than 25MB!');
        return Upload.LIST_IGNORE;
      }

      setFile(file);
      return false; // Prevent auto-upload
    }
  };

  const handleUpload = async () => {
    try {
      let extension = uploadData?.current?.path.split('.').pop();
      let type = fileTypesArray?.find((item) => item?.extensions?.includes(extension));

      let payload = {
        document: uploadData?.current?.path,
        file_type: type?.label,
        file_extension: extension,
        file_size: formatFileSize(file.size)
      };
      if (collectionId) {
        payload.collection_id = Number(collectionId);
      }

      const params = new URLSearchParams();
      params.append('id', id);
      let res = await addEmployeeDocumentApi(apiPath, params, payload);

      if (res?.statusCode === 200) {
        toast.success(res?.message || 'File uploaded');
        handleDocGet && handleDocGet();
        onClose();
        setFile(null);
        setLoading(false);
      } else {
        toast.error(res?.message || 'Something went wrong');
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    try {
      if (!file) {
        toast.error('Please upload a file first.');
        return;
      }
      setLoading(true);
      let uploadPath;
      if (apiPath === 'project') {
        uploadPath = `projectDoc/${id}/${file.name}`;
      } else {
        uploadPath = `employeeDoc/${id}/${file.name}`;
      }
      uploadData.current = { path: uploadPath };
      try {
        let extension = file?.name?.split('.').pop();
        let mediaType = fileTypesArray?.find((item) =>
          item?.extensions?.includes(extension)
        )?.label;
        let check = true;
        await uploadFileToS3(file, uploadPath, check, mediaType);
        handleUpload();
      } catch (error) {
        console.log(error, 'error');
        setLoading(false);
        toast.error('Failed to upload file. Please try again.');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
      setLoading(false);
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
          <h2>Add New Document</h2>
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
          <p className="upload-title">Upload accepts PDF, Image and Excel files only</p>
          <p className="upload-size">(Max. File size: 25 MB)</p>
        </Dragger>

        {file && (
          <div className="file-info">
            <strong>Selected File:</strong> {file.name}
          </div>
        )}

        <FlexWrapper justify={'end'}>
          <Button
            prefixCls="antCustomBtn"
            style={{ width: '140px', marginTop: '15px' }}
            onClick={onSubmit}
            loading={loading}
            disabled={!file}>
            Add
          </Button>
        </FlexWrapper>
      </UploadModalWrapper>
    </Modal>
  );
};

export default AddDocument;

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

  .file-info {
    margin-top: 12px;
    text-align: center;
    font-size: 13px;
    color: #333;
    word-break: break-all;
  }
`;
