/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { ModalCloseIcon } from '../../../../theme/SvgIcons';
import styled from '@emotion/styled';
import { FieldBox, FlexWrapper } from '../../../../theme/common_style';
import { updatePasswordbyAdmin } from '../../../../redux/employee/apiRoute';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdatePassword = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const payload = { ...values, employee_id: id };
      let res = await updatePasswordbyAdmin(payload);
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully updated');
        onClose();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error, 'error');
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="create-employees"
      width={376}
      centered
      closeIcon={false}
      footer={null}>
      <ModalCloseBox onClick={onClose}>
        <ModalCloseIcon />
      </ModalCloseBox>
      <ContentBox>
        <h4>Update Password</h4>

        <Form form={form} onFinish={handleUpdate}>
          <FieldBox>
            <label>
              Password <span>*</span>
            </label>
            <Form.Item
              name="new_password"
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
          <FieldBox>
            <label>
              Confirm Password <span>*</span>
            </label>
            <Form.Item
              name="confirm_password"
              rules={[
                { required: true, message: 'Confirm Password is required' },
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
                placeholder="Enter Confirm Password"
                autoComplete="off"
              />
            </Form.Item>
          </FieldBox>
          <FlexWrapper justify="end" style={{ marginTop: 20 }}>
            <Button
              loading={loading}
              onClick={() => form.submit()}
              style={{ width: 140 }}
              prefixCls="antCustomBtn">
              Update
            </Button>
          </FlexWrapper>
        </Form>
      </ContentBox>
    </Modal>
  );
};

export default UpdatePassword;

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
