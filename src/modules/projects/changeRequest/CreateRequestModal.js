import { Button, Form, Input, InputNumber, Modal, Radio } from 'antd';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { DeleteAttach, UploadDocumentIcon } from '../../../theme/SvgIcons';
import Dragger from 'antd/es/upload/Dragger';
import { FlexWrapper, GreyText, PurpleText } from '../../../theme/common_style';
import { toast } from 'react-toastify';
import styled from '@emotion/styled/macro';
import TextArea from 'antd/es/input/TextArea';
import { useParams } from 'react-router-dom';
import uploadFileToS3 from '../../../utils/uploadS3Bucket';
import { addChangeRequestApi, updateChangeRequestApi } from '../../../redux/project/apiRoute';
import { useForm } from 'antd/es/form/Form';
import { FieldBox } from '../../employees/EmployeesStyle';
import { capitalizeFirstLetter } from '../../../utils/common_functions';

const CreateRequestModal = ({ open, onCancel, handleListing, editDetails }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const uploadData = useRef(null);
  const { id } = useParams();
  const [file, setFile] = useState(null);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      let documentUrl = '';
      if (file) {
        let timestamp = Date.now();
        let uploadPath = `projectDoc/${id}/${timestamp}/${file.name}`;
        uploadData.current = { path: uploadPath };
        await uploadFileToS3(file, uploadPath);
        documentUrl = uploadPath;
      }

      let number = values?.no_of_hours?.toString();
      const payload = {
        ...values,
        no_of_hours: number,
        project_id: id
      };
      if (documentUrl) {
        payload.documents = [documentUrl];
      }
      let res;
      if (editDetails) {
        res = await updateChangeRequestApi(payload, editDetails?.id);
      } else {
        res = await addChangeRequestApi(payload);
      }
      if (res?.statusCode === 200) {
        toast.success('Request submitted successfully!');
        form.resetFields();
        handleListing();
        onCancel();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    accept: '.pdf,.jpg,.jpeg,.png,.webp',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      const isAllowed = allowedTypes.includes(file.type);

      if (!isAllowed) {
        alert('Only PDF and image files are allowed!');
        return Upload.LIST_IGNORE;
      }

      if (file.size / 1024 / 1024 > 25) {
        alert('File must be smaller than 25MB!');
        return Upload.LIST_IGNORE;
      }

      setFile(file);
      return false;
    }
  };

  useEffect(() => {
    if (editDetails) {
      form.setFieldsValue({
        title: editDetails.title || '',
        no_of_hours: editDetails.no_of_hours || '',
        client_approved: editDetails.client_approved,
        description: editDetails.description || '',
        links: editDetails.requestModule?.map((link) => link.link_url || '') || [{}]
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        links: ['']
      });
    }
  }, [editDetails]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      prefixCls="antCustomModal"
      width={600}
      footer={false}>
      <Title level={4} style={{ margin: 0 }}>
        {editDetails ? 'Edit Change Request' : 'Create New Change Request'}
      </Title>
      <Form form={form} onFinish={handleFinish} style={{ margin: '20px 0' }}>
        <FieldBox>
          <label>
            Title <Star>*</Star>
          </label>
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Title is required' }]}
            normalize={capitalizeFirstLetter}>
            <Input prefixCls="form-input" placeholder="Enter Title" />
          </Form.Item>
        </FieldBox>

        <FlexWrapper gap="20px" wrap="nowrap">
          <FieldBox style={{ width: '100%' }}>
            <label>
              No of Hours Approved <Star>*</Star>
            </label>
            <Form.Item
              name="no_of_hours"
              style={{ width: '100%' }}
              rules={[{ required: true, message: 'No. of hours is required' }]}>
              <InputNumber
                prefixCls="form-input-number"
                min={0}
                placeholder="Enter No. of Hours"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </FieldBox>
          <FieldBox style={{ width: '100%' }}>
            <label>
              Approved by client <Star>*</Star>
            </label>
            <Form.Item
              name="client_approved"
              style={{ width: 'fit-content' }}
              rules={[{ required: true, message: 'Select any one' }]}>
              <Radio.Group
                prefixCls="antCustomRadio"
                options={[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' }
                ]}
              />
            </Form.Item>
          </FieldBox>
        </FlexWrapper>

        <FieldBox>
          <FlexWrapper justify="space-between" width="100%">
            <label>
              Description <Star>*</Star>
            </label>
            <GreyText>Max 1000 characters </GreyText>
          </FlexWrapper>
          <Form.Item
            name="description"
            rules={[{ required: true, message: 'Description is required' }]}>
            <TextArea rows={5} maxLength={1000} placeholder="Write Description here" />
          </Form.Item>
        </FieldBox>

        <FieldBox>
          <Form.List name="links">
            {(fields, { add, remove }) => (
              <FlexWrapper direction="column" gap="10px" margin="0 0 20px" align="start">
                <FlexWrapper justify="space-between" width="100%">
                  <Title level={5} style={{ margin: 0 }}>
                    Links
                  </Title>
                  <PurpleText onClick={() => add()}>+ Add Link</PurpleText>
                </FlexWrapper>
                {fields.map((field) => (
                  <>
                    <label>URL</label>
                    <FlexWrapper
                      width="100%"
                      wrap="nowrap"
                      gap="10px"
                      key={field.key}
                      align="center">
                      <Form.Item
                        name={field.name}
                        rules={[{ required: false }]}
                        style={{ width: '100%', margin: 0 }}>
                        <Input prefixCls="form-input" placeholder="Enter link url" />
                      </Form.Item>
                      {field.name > 0 && (
                        <div onClick={() => remove(field.name)}>
                          <DeleteAttach style={{ height: '40px', width: '40px' }} />
                        </div>
                      )}
                    </FlexWrapper>
                  </>
                ))}
              </FlexWrapper>
            )}
          </Form.List>
        </FieldBox>

        <FlexWrapper direction="column" align="start">
          <Title level={5} style={{ margin: '10px 0' }}>
            Document
          </Title>
          <Dragger prefixCls="antCustomDragger" showUploadList={false} {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <UploadDocumentIcon />
            </p>
            <PurpleText>Upload Documents</PurpleText>
            <GreyText margin="5px 0">(Max. File size: 25 MB)</GreyText>
          </Dragger>
          {file && (
            <div className="file-info">
              <strong>Selected File:</strong> {file.name}
            </div>
          )}
        </FlexWrapper>

        <Form.Item>
          <FlexWrapper justify="end" style={{ marginTop: '20px' }}>
            <Button loading={loading} htmlType="submit" prefixCls="antCustomBtn">
              Save
            </Button>
          </FlexWrapper>
        </Form.Item>
      </Form>
    </Modal>
  );
};

CreateRequestModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  handleListing: PropTypes.func,
  editDetails: PropTypes.object
};

export default CreateRequestModal;

const Star = styled.span`
  color: red;
`;
