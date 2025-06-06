import { Button, Form, Input, Modal, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getEmployeeRolesApi } from '../../redux/employee/apiRoute';
import { CreateAdminApi, EditAdminApi } from '../../redux/sub-admin/apiRoute';
import { FieldBox, FlexWrapper } from '../../theme/common_style';
import { DropdownIconNew } from '../../theme/SvgIcons';
import { decryptToken } from '../../utils/common_functions';
import { CreateFormWrapper } from '../employees/EmployeesStyle';

const AddSubAdmin = ({ open, onClose, editDetails, handleListing }) => {
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const getEmployeeRoles = async () => {
    let res = await getEmployeeRolesApi();
    if (res?.statusCode === 200) {
      let array = res?.data?.roles?.map((el) => ({
        ...el,
        label: el?.role,
        value: el?.id
      }));
      setEmployeeRoles(array);
    } else {
      toast.error(res?.message || 'Something went wrong');
    }
  };
  const handleCreate = async () => {
    try {
      setLoading(true);

      const payload = { ...form.getFieldsValue() };
      let res;

      if (editDetails) {
        res = await EditAdminApi(editDetails?.account_id, payload);
      } else {
        res = await CreateAdminApi(payload);
      }
      if (res?.statusCode === 200) {
        handleListing();
        onClose();
      } else toast.error(res?.message || 'Something went wrong!');
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editDetails) {
      form.setFieldsValue({
        email: editDetails?.account_email,
        role_id: editDetails?.account_role_id?.toString(),
        password: decryptToken(editDetails?.account_password)
      });
    }
  }, [editDetails]);

  useEffect(() => {
    getEmployeeRoles();
  }, []);

  return (
    <Modal
      open={open}
      maskClosable={false}
      onCancel={onClose}
      centered
      width={500}
      footer={null}
      prefixCls="antCustomModal">
      <CreateFormWrapper>
        <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
          {editDetails ? 'Edit' : 'Create'} Sub Admin
        </Title>
        <Form autoComplete="off" form={form} onFinish={handleCreate}>
          {() => (
            <>
              <FieldBox>
                <label>
                  Email <span>*</span>
                </label>
                <Form.Item
                  name="email"
                  validateFirst={true}
                  rules={[
                    { required: true, message: 'Email is required' },
                    {
                      type: 'email',
                      message: 'Please enter a valid email!',
                      required: true
                    }
                  ]}>
                  <Input prefixCls="form-input" placeholder="Enter Email" />
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label>
                  Role <span>*</span>
                </label>
                <Form.Item name="role_id" rules={[{ required: true, message: 'Role is required' }]}>
                  <Select
                    prefixCls="form-select"
                    allowClear
                    style={{ marginBottom: '10px', textTransform: 'capitalize' }}
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--">
                    {employeeRoles?.map(
                      (role, index) =>
                        role?.label !== 'standard' && (
                          <Select.Option
                            key={index}
                            value={role.value}
                            style={{ textTransform: 'capitalize' }}>
                            {role.label}
                          </Select.Option>
                        )
                    )}
                  </Select>
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label>
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
              <FlexWrapper justify="end">
                <Button
                  style={{ width: '140px', marginTop: '20px' }}
                  prefixCls="antCustomBtn"
                  onClick={form.submit}
                  loading={loading}>
                  Save
                </Button>
              </FlexWrapper>
            </>
          )}
        </Form>
      </CreateFormWrapper>
    </Modal>
  );
};

export default AddSubAdmin;

AddSubAdmin.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  editDetails: PropTypes.object,
  handleListing: PropTypes.func
};
