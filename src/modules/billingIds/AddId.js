import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Upload } from 'antd';
import 'react-phone-input-2/lib/style.css';
import { CreateFormWrapper, CreateModalWrapper, ModalCloseBox } from '../employees/EmployeesStyle';
import AvatarImage from '../../components/common/AvatarImage';
import { DropdownIconNew, ModalCloseIcon } from '../../theme/SvgIcons';
import { FieldBox, FlexWrapper, GridBox } from '../../theme/common_style';
import PropTypes from 'prop-types';
import { AddProjectSource, UpdateProjectSource } from '../../redux/billingIds/apiRoute';
import { toast } from 'react-toastify';
import { ProjectSource } from '../../utils/constant';
import uploadFileToS3, { deleteS3Object } from '../../utils/uploadS3Bucket';

const AddId = ({ open, onClose, editDetails, handleGetList }) => {
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState(null);
  const image_baseurl = process.env.REACT_APP_S3_BASE_URL;
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      let uploadPath;
      const values = form.getFieldsValue();
      if (profileImage && values?.profile_image) {
        const timestamp = Date.now();
        uploadPath = `billingIds/profileImg/${timestamp}.jpg`;
        try {
          if (editDetails?.profile_image) {
            await deleteS3Object(editDetails?.profile_image);
          }
          console.log(values?.profile_image, 'reeew');
          console.log(uploadPath, 'ree');
          let res = await uploadFileToS3(values?.profile_image, uploadPath);
          console.log(res, 'resresresres');
        } catch (err) {
          console.error('S3 image update failed:', err);
        }
      }
      const payload = { ...values, profile_image: uploadPath };
      let res;
      if (editDetails) {
        res = await UpdateProjectSource(editDetails?.id, {
          ...payload
        });
      } else {
        res = await AddProjectSource(payload);
      }
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Client added successfully');
        handleGetList && handleGetList();
        onClose();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (file) => {
    const rawFile = file.originFileObj || file;

    if (rawFile) {
      const previewUrl = URL.createObjectURL(rawFile);
      setProfileImage(previewUrl);

      form.setFieldsValue({
        profile_image: rawFile
      });
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast.error('Only image files JPG are allowed!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  useEffect(() => {
    if (editDetails) {
      form.setFieldsValue({
        name: editDetails?.name || '',
        email: editDetails?.email || '',
        user_name: editDetails?.user_name || '',
        password: editDetails?.password || '',
        source_name: editDetails?.source_name || '',
        mfa_id: editDetails?.mfa_id || '',
        security_id: editDetails?.security_id || ''
      });
    } else {
      form.resetFields();
      setProfileImage(null);
    }
  }, [editDetails]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={1000}
      footer={null}
      prefixCls="create-employees"
      closeIcon={false}>
      <CreateModalWrapper>
        <ModalCloseBox onClick={onClose}>
          <ModalCloseIcon />
        </ModalCloseBox>
        <div className="title">
          <h2>{editDetails ? 'Edit' : 'Add New'} Id</h2>
        </div>

        <Form autoComplete="off" form={form} onFinish={handleCreate}>
          <CreateFormWrapper>
            <div className="upload-image">
              <AvatarImage
                style={{ width: '100px', height: '100px' }}
                image={image_baseurl + editDetails?.profile_image}
                name={false}
                preview={profileImage}
              />
              <Upload
                showUploadList={false}
                customRequest={({ file }) => {
                  handleImageUpload(file);
                }}
                beforeUpload={beforeUpload}>
                <p>Upload Profile Photo</p>
              </Upload>
              <Form.Item name="profile_image" noStyle></Form.Item>
            </div>

            <GridBox cols={2}>
              <FieldBox>
                <label htmlFor="source_name">
                  Source <span>*</span>
                </label>
                <Form.Item
                  name="source_name"
                  rules={[{ required: true, message: 'Source Name is required' }]}>
                  <Select
                    prefixCls="form-select"
                    allowClear
                    style={{ marginBottom: '10px' }}
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--">
                    {ProjectSource?.map((role, index) => (
                      <Select.Option
                        key={index}
                        value={role.value}
                        style={{ textTransform: 'capitalize' }}>
                        {role.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label htmlFor="email">
                  Email <span>*</span>
                </label>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Email is required' },
                    {
                      type: 'email',
                      message: 'Please enter a valid email!'
                    }
                  ]}>
                  <Input prefixCls="form-input" type="email" placeholder="Enter Your Email" />
                </Form.Item>
              </FieldBox>
            </GridBox>

            <GridBox cols={3}>
              <FieldBox>
                <label htmlFor="user_name">
                  Username <span>*</span>
                </label>
                <Form.Item
                  name="user_name"
                  rules={[{ required: true, message: 'Username is required' }]}>
                  <Input prefixCls="form-input" type="text" placeholder="Enter Your Username" />
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label htmlFor="name">
                  Full Name <span>*</span>
                </label>
                <Form.Item
                  name="name"
                  validateFirst={true}
                  rules={[
                    { required: true, message: 'Name is required' },
                    {
                      validator: (_, value) =>
                        value && value.trim().length >= 3
                          ? Promise.resolve()
                          : Promise.reject(new Error('Name must be at least 3 characters'))
                    }
                  ]}
                  normalize={(value) => {
                    if (!value) return value;
                    return value.charAt(0).toUpperCase() + value.slice(1);
                  }}>
                  <Input prefixCls="form-input" placeholder="Enter Your Name" />
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label htmlFor="password">
                  Password <span>*</span>
                </label>
                <Form.Item
                  name="password"
                  validateFirst={true}
                  rules={[
                    { required: true, message: 'Password is required' },
                    {
                      min: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    {
                      pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                      message: 'Password must contain a number and a special character'
                    }
                  ]}>
                  <Input.Password
                    prefixCls="form-input"
                    placeholder="Enter Password"
                    autoComplete="off"
                  />
                </Form.Item>
              </FieldBox>
            </GridBox>

            <GridBox cols={2}>
              <FieldBox style={{ width: '100%' }}>
                <label htmlFor="mfa_id">MFA Phone Number or Email</label>
                <Form.Item
                  name="mfa_id"
                  validateFirst={true}
                  rules={[
                    { required: false },
                    {
                      validator: (_, value) => {
                        if (!value?.trim()) {
                          return Promise.resolve();
                        }

                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        const phoneRegex = /^\+?\d{10,15}$/;

                        if (emailRegex.test(value) || phoneRegex.test(value)) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          'Enter a valid email or phone number (e.g., +1234567890)'
                        );
                      }
                    }
                  ]}>
                  <Input prefixCls="form-input" placeholder="Enter MFA phone number or email" />
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label htmlFor="security_id">Security Code</label>
                <Form.Item
                  name="security_id"
                  validateFirst={true}
                  rules={[
                    { required: false },
                    {
                      validator: (_, value) => {
                        if (!value?.trim()) {
                          return Promise.resolve();
                        }
                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(
                            new Error('Security Code must contain only numbers')
                          );
                        }
                        if (value.length < 6 || value.length > 12) {
                          return Promise.reject(
                            new Error('Security Code must be between 6 and 12 digits')
                          );
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <Input prefixCls="form-input" placeholder="Enter Security Code" />
                </Form.Item>
              </FieldBox>
            </GridBox>
          </CreateFormWrapper>

          <FlexWrapper justify={'end'} gap={'10px'} style={{ marginTop: '20px' }} cursor="default">
            <Button
              loading={loading}
              onClick={form.submit}
              style={{ width: '140px' }}
              prefixCls="antCustomBtn">
              Save
            </Button>
          </FlexWrapper>
        </Form>
      </CreateModalWrapper>
    </Modal>
  );
};

export default AddId;

AddId.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  editDetails: PropTypes.object,
  handleGetList: PropTypes.func
};
