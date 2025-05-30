import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { PropagateLoader } from 'react-spinners';
import { Avatar, Button, Drawer, Table } from 'antd';
import { DeleteIconBox, EditIconBox, FlexWrapper, ViewIconBox } from '../../theme/common_style';
import { DeleteIcon, EditIcon, TrashIconNew, ViewIconNew } from '../../theme/SvgIcons';
import ManipulateRoleModal from '../../components/Modal/ManipulateRoleModal';
import '../../theme/antCustomComponents.css';
import '../../theme/antCustomTable.css';
import { checkPermission, formatDate } from '../../utils/common_functions';
import {
  createRoleAPI,
  deleteRoleApi,
  getAllRolesAPI,
  updateRoleAPI
} from '../../redux/role-management/apiRoute';
import { toast } from 'react-toastify';
import tableLoader from '../../components/loaders/TableLoader';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import ActivityDrawer from './ActivityDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { updateActivityDrawer } from '../../redux/sidebar/SidebarSlice';
import { StickyBox } from '../../utils/style';

function RoleManagement() {
  const [showModal, setShowModal] = useState(false);
  const [manipulationType, setManipulationType] = useState('');
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editDetails, setEditDetails] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  // const [activityDrawer, setActivityDrawer] = useState(false);
  const navigate = useNavigate();
  const { permissions } = useSelector((state) => state?.userInfo?.data);

  const canCreate = checkPermission('roles', 'create', permissions);
  const canDelete = checkPermission('roles', 'del', permissions);
  const canUpdate = checkPermission('roles', 'update', permissions);
  const activityDrawer = useSelector((state) => state?.sidebar?.isActivityDrawer);
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'S.NO',
      dataIndex: 'sno',
      key: 'sno'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <span style={{ textTransform: 'capitalize' }}>{role}</span>
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (role) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'}>
            {role.img ? <Avatar src={role.img} /> : null}
            <span>{role.name}</span>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate'
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      className: 'action-column',
      render: (_, data) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'}>
            <ViewIconBox
              onClick={() => {
                navigate(`/roles/role/${data.id}`, {
                  state: { role: data?.role, members: data?.members }
                });
              }}>
              <ViewIconNew />
            </ViewIconBox>
            {canUpdate && (
              <EditIconBox
                canUpdate={canUpdate}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                  setManipulationType('Edit Role');
                  setEditDetails(data);
                }}>
                <EditIcon />
              </EditIconBox>
            )}
            {canDelete && (
              <DeleteIconBox
                onClick={() => {
                  if (data?.members === 0) {
                    setDeleteModal(true);
                    setEditDetails(data);
                  }
                }}
                canDelete={data?.members === 0 && canDelete}>
                <DeleteIcon />
              </DeleteIconBox>
            )}
          </FlexWrapper>
        );
      }
    }
  ];

  const getAllRoles = async () => {
    try {
      setLoading(true);

      const res = await getAllRolesAPI();
      if (res?.statusCode === 200) {
        const data = (res?.data?.roles?.roles || res?.data?.roles || [])?.reduce((acc, item, i) => {
          const obj = {
            ...item,
            id: item?.id,
            key: item?.id,
            sno: i + 1,
            role: item?.role || '-',
            createdBy: { name: item?.created_by || '-' },
            createdDate: formatDate(item?.created_at) || '-',
            members: item?.user_count || 0,
            permissions: item?.rolePermission
          };
          console.log(obj);
          acc?.push(obj);
          return acc;
        }, []);
        setRoles(data);
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

  const CreateRole = async (payload) => {
    try {
      setActionLoading(true);
      let res = await createRoleAPI(payload);
      if (res?.statusCode === 200) {
        getAllRoles();
        toast.success('Role created successfully');
        setShowModal(false);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setActionLoading(false);
    }
  };

  const EditRole = async (payload) => {
    try {
      setActionLoading(true);
      let filteredPayload = { ...payload, role_id: editDetails?.id };
      let res = await updateRoleAPI(filteredPayload);
      if (res?.statusCode === 200) {
        getAllRoles();
        toast.success('Role updated successfully');
        setShowModal(false);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    try {
      setActionLoading(true);
      let params = new URLSearchParams();
      params.append('id', editDetails?.id);
      let res = await deleteRoleApi(params);
      if (res?.statusCode === 200) {
        toast.success('Role deleted successfully');
        getAllRoles();
        setDeleteModal(false);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  return (
    <div>
      {activityDrawer && (
        <Drawer
          width={490}
          title="Activity"
          placement="right"
          closable={true}
          prefixCls="activityCustomDrawer"
          onClose={() => dispatch(updateActivityDrawer(false))}
          open={activityDrawer}
          key="right">
          <ActivityDrawer />
        </Drawer>
      )}
      <StickyBox>
        <FlexWrapper
          width={'100%'}
          justify={'space-between'}
          gap="16px"
          style={{ marginBottom: '10px' }}>
          {canCreate && (
            <Button
              prefixCls="antCustomBtn"
              onClick={() => {
                setShowModal(true);
                setManipulationType('Create Role');
                setEditDetails(null);
              }}>
              + Create Role
            </Button>
          )}
          {/* <FlexWrapper
          gap="6px"
          style={{ cursor: 'pointer' }}
          onClick={() => setActivityDrawer(true)}>
          <HistoryIcon color={colors.darkSkyBlue} />
          <p style={{ color: colors.darkSkyBlue }}>Activity</p>
        </FlexWrapper> */}
        </FlexWrapper>
      </StickyBox>
      {/* {loading ? (
        <FlexWrapper style={{ height: '300px' }}>
          <PropagateLoader color="#7c71ff" size="15" />
        </FlexWrapper>
      ) : ( */}
      <>
        <Table
          prefixCls="antCustomTable"
          columns={columns}
          dataSource={roles}
          // pagination={}
          pagination={roles?.length > 20 ? { prefixCls: 'custom-pagination', pageSize: 20 } : false}
          loading={{ spinning: loading, indicator: tableLoader }}
          // onRow={(record) => ({
          //   onClick: (event) => {
          //     if (event.target.closest('.action-column')) return;
          //     navigate(`/roles/role/${record?.id}`, { state: { role: record?.role } });
          //   }
          // })}
        />
        {/* <PaginationBox>
          <Pagination
            current={page}
            prefixCls="custom-pagination"
            pageSize={limit}
            total={total}
            onChange={handleTableChange}
            showSizeChanger={false}
          />
        </PaginationBox> */}
        <ManipulateRoleModal
          open={showModal}
          setOpen={setShowModal}
          type={manipulationType}
          handleFinish={manipulationType === 'Create Role' ? CreateRole : EditRole}
          editDetails={editDetails}
          loading={actionLoading}
        />
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
            loading={actionLoading}
          />
        )}
      </>
      {/* )} */}
    </div>
  );
}
export default RoleManagement;

// const PaginationBox = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: flex-end;
//   margin-top: 20px;
// `;
