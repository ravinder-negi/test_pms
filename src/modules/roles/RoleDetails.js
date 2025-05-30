import { Checkbox, Drawer, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { DeleteIconBox, EditIconBox, FlexWrapper, LinkStyled } from '../../theme/common_style';
import { DeleteIcon, EditIcon, HistoryIcon, TrashIconNew } from '../../theme/SvgIcons';
import colors from '../../theme/colors';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ActivityDrawer from './ActivityDrawer';
import {
  deleteRoleApi,
  getRolePermissionsAPI,
  updateRoleAPI
} from '../../redux/role-management/apiRoute';
import styled from '@emotion/styled';
import ManipulateRoleModal from '../../components/Modal/ManipulateRoleModal';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import { checkPermission } from '../../utils/common_functions';
import { useSelector } from 'react-redux';

const RoleDetails = () => {
  const location = useLocation();
  const { role, members } = location.state || {};
  const { Title } = Typography;
  const [activityDrawer, setActivityDrawer] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const userPermissions = useSelector((state) => state?.userInfo?.data?.permissions);
  const canUpdate = checkPermission('roles', 'update', userPermissions);
  const canDelete = checkPermission('roles', 'del', userPermissions);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);

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

  // Fetch role permissions
  const getRollPermissions = async () => {
    try {
      let params = new URLSearchParams();
      params.append('role_id', id);
      let res = await getRolePermissionsAPI(params);
      if (res?.statusCode === 200) {
        setPermissions(res?.data || []);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    getRollPermissions();
  }, []);

  let permissionMap =
    permissions?.length > 0 &&
    permissions?.reduce((acc, item) => {
      acc[item?.module] = item;
      return acc;
    }, {});

  const EditRole = async (payload) => {
    try {
      setLoading(true);
      let filteredPayload = { ...payload, role_id: id };
      let res = await updateRoleAPI(filteredPayload);
      if (res?.statusCode === 200) {
        toast.success('Role updated successfully');
        getRollPermissions();
        setShowModal(false);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    try {
      setLoading(true);
      let params = new URLSearchParams();
      params.append('id', id);
      let res = await deleteRoleApi(params);
      if (res?.statusCode === 200) {
        toast.success('Role deleted successfully');
        navigate('/roles');
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
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
      render: (_, record) => (
        <CustomCheckbox disabled checked={permissionMap[record.section]?.read || false} />
      )
    },
    {
      title: 'Update',
      dataIndex: 'update',
      key: 'update',
      render: (_, record) => (
        <CustomCheckbox disabled checked={permissionMap[record.section]?.update || false} />
      )
    },
    {
      title: 'Create',
      dataIndex: 'create',
      key: 'create',
      render: (_, record) => (
        <CustomCheckbox disabled checked={permissionMap[record.section]?.create || false} />
      )
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      render: (_, record) => (
        <CustomCheckbox disabled checked={permissionMap[record.section]?.del || false} />
      )
    },
    {
      title: 'Full Access',
      dataIndex: 'fullAccess',
      key: 'fullAccess',
      render: (_, record) => (
        <CustomCheckbox
          disabled
          checked={
            permissionMap[record.section]?.read &&
            permissionMap[record.section]?.update &&
            permissionMap[record.section]?.create &&
            permissionMap[record.section]?.del
          }
        />
      )
    }
  ];

  const data = sections.map((item, i) => ({
    key: i + 1,
    section: item,
    name: item === 'SubAdmin' ? 'Sub-Admin' : item === 'roles' ? 'Role Management' : item
  }));

  return (
    <div style={{ textAlign: 'left' }}>
      {showModal && (
        <ManipulateRoleModal
          open={showModal}
          setOpen={setShowModal}
          type={'Edit Role'}
          handleFinish={EditRole}
          editDetails={{ role: role, permissions }}
          loading={loading}
        />
      )}
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Role'}
          onSubmit={handleDeleteRole}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this role?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={loading}
        />
      )}
      {activityDrawer && (
        <Drawer
          width={490}
          title="Activity"
          placement="right"
          closable={true}
          prefixCls="activityCustomDrawer"
          onClose={() => setActivityDrawer(false)}
          open={activityDrawer}
          key="right">
          <ActivityDrawer />
        </Drawer>
      )}
      <FlexWrapper justify="space-between" style={{ marginBottom: '16px' }}>
        <div style={{ textTransform: 'capitalize' }}>
          <LinkStyled to={'/roles'}>Role Management</LinkStyled> / {role}
        </div>
        <FlexWrapper
          gap="6px"
          style={{ cursor: 'pointer' }}
          onClick={() => setActivityDrawer(true)}>
          <HistoryIcon color={colors.darkSkyBlue} />
          <div style={{ color: colors.darkSkyBlue }}>Activity</div>
        </FlexWrapper>
      </FlexWrapper>
      <FlexWrapper justify="space-between">
        <Title level={4} style={{ margin: '0', textTransform: 'capitalize' }}>
          {role}
        </Title>
        <FlexWrapper gap="6px">
          {canUpdate && (
            <EditIconBox canUpdate={canUpdate} onClick={() => setShowModal(true)}>
              <EditIcon />
            </EditIconBox>
          )}
          {members === 0 && canDelete && (
            <DeleteIconBox canDelete={canDelete} onClick={() => setDeleteModal(true)}>
              <DeleteIcon />
            </DeleteIconBox>
          )}
        </FlexWrapper>
      </FlexWrapper>
      <Table
        prefixCls="antCustomTable"
        columns={columns}
        dataSource={data}
        pagination={false}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default RoleDetails;

const CustomCheckbox = styled(Checkbox)`
  &.ant-checkbox-wrapper .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #7c71ff !important; /* Ant Design Primary Blue */
    border-color: #ffffff !important;
  }
  &.ant-checkbox-wrapper-disabled .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #7c71ff !important;
    border-color: #ffffff !important;
    opacity: 1 !important; /* Prevents the disabled fade effect */
  }
  &.ant-checkbox-wrapper-disabled .ant-checkbox-checked .ant-checkbox-inner:after {
    border-color: #ffffff !important;
  }
`;
