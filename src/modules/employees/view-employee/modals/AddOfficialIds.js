/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { DropdownIconNew, ModalCloseIcon } from '../../../../theme/SvgIcons';
import styled from '@emotion/styled';
import { FieldBox, FlexWrapper } from '../../../../theme/common_style';
import TextArea from 'antd/es/input/TextArea';
import {
  createEmployeeCredentialApi,
  updateEmployeeCredentialApi
} from '../../../../redux/employee/apiRoute';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { platformOptions } from '../../../../utils/constant';
import { capitalizeFirstLetter } from '../../../../utils/common_functions';
const { Option } = Select;

const AddOfficialIds = ({ open, onClose, editDetails, handleList, handleGetAllEmployees }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [addNewPlatform, setAddNewPlatform] = useState(false);

  const handleAddOrUpdate = async (values) => {
    setLoading(true);
    try {
      let res;
      if (editDetails?.id) {
        res = await updateEmployeeCredentialApi(values, editDetails.id);
      } else {
        res = await createEmployeeCredentialApi(values, id);
      }

      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully saved');
        onClose();
        handleList();
        handleGetAllEmployees();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editDetails) {
      const isAlreadyAdd = platformOptions?.find((val) => val?.value == editDetails?.service_type);
      setAddNewPlatform(isAlreadyAdd != undefined ? false : true);
      const { service_type, service_url, email_user_name, password, mfa_id, recovery_id, remarks } =
        editDetails;

      form.setFieldsValue({
        service_type,
        service_url,
        email_user_name,
        password,
        mfa_id,
        recovery_id,
        remarks
      });
    } else {
      form.resetFields();
    }
  }, [editDetails, form, open]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="create-employees"
      width={500}
      centered
      closeIcon={false}
      footer={null}>
      <ModalCloseBox onClick={onClose}>
        <ModalCloseIcon />
      </ModalCloseBox>
      <ContentBox>
        <h4>Office Essentials IDs</h4>

        <Form form={form} onFinish={handleAddOrUpdate}>
          <>
            <FieldBox>
              <div className="addition-div">
                <label htmlFor="service_type">
                  Platform <span>*</span>
                </label>
                <p
                  onClick={() => {
                    form.setFieldValue('service_type', null);
                    setAddNewPlatform(!addNewPlatform);
                  }}>
                  {addNewPlatform ? '- Remove' : '+ Add'}
                </p>
              </div>
              <Form.Item
                name="service_type"
                rules={[{ required: true, message: 'Platform is required' }]}
                normalize={capitalizeFirstLetter}>
                {addNewPlatform ? (
                  <Input prefixCls="form-input" placeholder="Enter your platform" maxLength={25} />
                ) : (
                  <Select
                    prefixCls="form-select"
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--">
                    {platformOptions?.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label htmlFor="service_url">Platform URL</label>
              <Form.Item
                name="service_url"
                type="text"
                rules={[
                  {
                    validator: (_, value) => {
                      const platformValue = form.getFieldValue('service_type');
                      const platformExists = platformOptions?.some(
                        (option) => option.value === platformValue
                      );

                      if (!platformExists) {
                        if (!value) {
                          return Promise.reject('Platform URL is required for custom platforms');
                        }

                        const urlPattern = /^(http|https):\/\/[^ "]+$/;
                        if (!urlPattern.test(value)) {
                          return Promise.reject(
                            'Please enter a valid URL (e.g., https://example.com)'
                          );
                        }
                      }

                      return Promise.resolve();
                    }
                  }
                ]}>
                <Input prefixCls="form-input" placeholder="Enter Platform URL" />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label htmlFor="email_user_name">
                Email or Username <span>*</span>
              </label>
              <Form.Item
                name="email_user_name"
                validateFirst
                type="text"
                rules={[
                  { required: true, message: 'Email or Username is required' },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject('Email or Username is required');
                      }

                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/; // Customize as needed

                      if (emailRegex.test(value) || usernameRegex.test(value)) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        'Enter a valid email or username (min 3 characters, no spaces)'
                      );
                    }
                  }
                ]}>
                <Input prefixCls="form-input" placeholder="Enter email or username" />
              </Form.Item>
            </FieldBox>

            <FieldBox>
              <label htmlFor="password">
                Password <span>*</span>
              </label>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Password is required' }]}>
                <Input.Password
                  prefixCls="form-input"
                  placeholder="Enter Password"
                  autoComplete="off"
                />
              </Form.Item>
            </FieldBox>
            <FlexWrapper gap="10px" width="100%" wrap="unset">
              <FieldBox style={{ width: '100%' }}>
                <label htmlFor="mfa_id">MFA Phone Number or Email</label>
                <Form.Item
                  name="mfa_id"
                  validateFirst={true}
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) {
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
            </FlexWrapper>
            <FieldBox>
              <label htmlFor="recovery_id">Recovery Phone Number or Email</label>
              <Form.Item
                name="recovery_id"
                validateFirst
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }

                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      const phoneRegex = /^\+?\d{10,15}$/;

                      if (emailRegex.test(value) || phoneRegex.test(value)) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        'Enter a valid email or phone number (e.g., user@example.com or +1234567890)'
                      );
                    }
                  }
                ]}
                type="text">
                <Input prefixCls="form-input" placeholder="Enter recovery phone number or email" />
              </Form.Item>
            </FieldBox>

            <FieldBox>
              <label htmlFor="remarks">Remarks</label>
              <Form.Item name="remarks">
                <TextArea
                  style={{
                    height: 120,
                    resize: 'none',
                    border: '1px solid #C8C8C8',
                    borderRadius: 8,
                    padding: 10
                  }}
                  placeholder="Enter Remarks"
                />
              </Form.Item>
            </FieldBox>

            <FlexWrapper justify="end" style={{ marginTop: 20 }}>
              <Button
                loading={loading}
                onClick={() => form.submit()}
                style={{ width: 140 }}
                prefixCls="antCustomBtn">
                Save
              </Button>
            </FlexWrapper>
          </>
        </Form>
      </ContentBox>
    </Modal>
  );
};

export default AddOfficialIds;

const ContentBox = styled.div`
  width: 100%;
  padding: 24px;

  h4 {
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 24px;
    color: #0e0e0e;
    margin: 0;
    text-align: center;
  }
`;
