import React, { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Input, Modal, Switch, Table, Typography } from 'antd';
import { FlexWrapper } from '../../theme/common_style';
import PropTypes from 'prop-types';
import '../../theme/antCustomComponents.css';
import '../../theme/antCustomTable.css';
import { transformPermissions } from '../../utils/common_functions';
import styled from '@emotion/styled';

const ManipulateRoleModal = ({ open, setOpen, type, handleFinish, editDetails, loading }) => {
  const [selectedValues, setSelectedValues] = useState({});
  const [roleName, setRoleName] = useState('');
  const [errors, setErrors] = useState({});
  const { Title } = Typography;

  const closeModal = () => {
    setOpen(false);
    setSelectedValues({});
    setRoleName('');
    setErrors({});
  };

  const handleChange = (name, value) => {
    setSelectedValues((prev) => {
      const updatedValues = { ...prev, [name]: value };
      const section = name.replace(/(Read|Update|Create|Delete)$/, '');

      if (name.includes('Read') && !value) {
        updatedValues[`${section}Update`] = false;
        updatedValues[`${section}Create`] = false;
        updatedValues[`${section}Delete`] = false;
      }

      if (name.includes('Delete') && value) {
        updatedValues[`${section}Create`] = true;
      }

      if ((name.includes('Delete') && value) || (name.includes('Create') && value)) {
        updatedValues[`${section}Update`] = true;
      }

      if (name.includes('Update') || name.includes('Create') || name.includes('Delete')) {
        updatedValues[`${section}Read`] = true;
      }

      return updatedValues;
    });
  };

  const handleOk = () => {
    if (!roleName || roleName.trim()?.length === 0) {
      setErrors((prev) => ({ ...prev, RoleNameError: 'Please Enter Role Name' }));
      return false;
    }
    if (
      Object.keys(selectedValues)?.length === 0 ||
      !Object.values(selectedValues)?.includes(true)
    ) {
      setErrors((prev) => ({
        ...prev,
        CheckboxError: 'Please select permissions',
        RoleNameError: ''
      }));
      return false;
    }
    handleFinish(transformPermissions(roleName, selectedValues));
    setErrors({});
    return true;
  };

  const columns = [
    {
      title: 'Section',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Read',
      dataIndex: 'read',
      key: 'read',
      render: (section) => {
        return (
          <Checkbox
            prefixCls="antCustomCheckbox"
            checked={selectedValues?.[`${section}Read`]}
            onChange={(e) => handleChange(`${section}Read`, e.target.checked)}
          />
        );
      }
    },
    {
      title: 'Update',
      dataIndex: 'update',
      key: 'update',
      render: (section) => (
        <Checkbox
          prefixCls="antCustomCheckbox"
          checked={selectedValues?.[`${section}Update`] || false}
          onChange={(e) => handleChange(`${section}Update`, e.target.checked)}
        />
      )
    },
    {
      title: 'Create',
      dataIndex: 'create',
      key: 'create',
      render: (section) => (
        <Checkbox
          prefixCls="antCustomCheckbox"
          checked={selectedValues?.[`${section}Create`] || false}
          onChange={(e) => handleChange(`${section}Create`, e.target.checked)}
        />
      )
    },
    {
      title: 'Delete',
      dataIndex: 'del',
      key: 'del',
      render: (section) => (
        <Checkbox
          prefixCls="antCustomCheckbox"
          checked={selectedValues?.[`${section}Delete`] || false}
          onChange={(e) => handleChange(`${section}Delete`, e.target.checked)}
        />
      )
    }
  ];

  const sections = [
    'Dashboard',
    'Projects',
    'Reporting',
    'Employee',
    'SubAdmin',
    'LMS',
    'Notifications',
    'Settings',
    'Clients',
    'roles',
    'HMS',
    'Billing Ids'
  ];

  const data = sections.map((item, i) => ({
    key: i + 1,
    section: item,
    name: item === 'SubAdmin' ? 'Sub-Admin' : item === 'roles' ? 'Role Management' : item,
    read: item,
    update: item,
    create: item,
    del: item
  }));

  const handleFullAccess = (val) => {
    const updatedValues = {};
    sections.forEach((item) => {
      updatedValues[`${item}Read`] = val;
      updatedValues[`${item}Update`] = val;
      updatedValues[`${item}Create`] = val;
      updatedValues[`${item}Delete`] = val;
    });
    setSelectedValues(updatedValues);
  };

  let fullAccessVal = useMemo(() => {
    const totalCount = sections.length * 4;
    const permissionArr = Object.values(selectedValues);
    if (permissionArr.length === 0 || permissionArr.length !== totalCount) {
      return false;
    }
    const value = permissionArr.find((item) => item === false);
    return value === undefined ? true : false;
  }, [selectedValues]);

  useEffect(() => {
    if (editDetails) {
      setRoleName(editDetails?.role || '');

      const permissions = {};
      (editDetails?.permissions || []).forEach((item) => {
        permissions[`${item.module}Read`] = item.read;
        permissions[`${item.module}Update`] = item.update;
        permissions[`${item.module}Create`] = item.create;
        permissions[`${item.module}Delete`] = item.del;
      });

      setSelectedValues(permissions);
    } else {
      setSelectedValues({});
      setRoleName('');
      setErrors({});
    }
  }, [editDetails, open]);

  useEffect(() => {
    if (!open) {
      setSelectedValues({});
      setRoleName('');
      setErrors({});
    }
  }, [open]);

  return (
    <div>
      <Modal
        open={open}
        prefixCls="antCustomModal"
        width={800}
        centered
        title={
          <Title level={4} style={{ textAlign: 'center' }}>
            {type}
          </Title>
        }
        onCancel={closeModal}
        footer={[
          <Button loading={loading} prefixCls="antCustomBtn" key="back" onClick={handleOk}>
            {type === 'Create Role' ? 'Add' : type === 'Edit Role' ? 'Save' : ''}
          </Button>
        ]}>
        <FlexWrapper direction="column" align="start" gap="6px">
          <label>Role Name</label>
          <Input
            placeholder="Enter role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
          {errors?.RoleNameError && (
            <p style={{ color: 'red', margin: '0' }}>{errors?.RoleNameError}</p>
          )}
        </FlexWrapper>
        <FlexWrapper direction="column" align="end" gap="6px" margin="20px 0 0">
          <FullAccessBtn>
            <span>Full Access</span>
            <Switch
              checked={fullAccessVal}
              className="custom-switch"
              onChange={(val) => handleFullAccess(val)}
            />
          </FullAccessBtn>
        </FlexWrapper>
        <Table
          prefixCls="antCustomTable"
          columns={columns}
          dataSource={data}
          pagination={false}
          style={{ marginTop: '10px' }}
        />
        {errors?.CheckboxError && <p style={{ color: 'red' }}>{errors?.CheckboxError}</p>}
      </Modal>
    </div>
  );
};

export default ManipulateRoleModal;

ManipulateRoleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  handleFinish: PropTypes.func,
  editDetails: PropTypes.array,
  loading: PropTypes.bool
};

const FullAccessBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  span {
    font-weight: 600;
  }

  .custom-switch.ant-switch-checked {
    background-color: #7c71ff;
  }

  .custom-switch.ant-switch-checked:hover {
    background-color: #7c71ffe0;
  }
`;
