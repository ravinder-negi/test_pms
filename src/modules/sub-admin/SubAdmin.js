import { Button, Drawer, Input, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../../components/loaders/TableLoader';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import SearchField from '../../components/searchField/SearchField';
import { updateActivityDrawer } from '../../redux/sidebar/SidebarSlice';
import { DeleteAdminApi, GetAdminListing } from '../../redux/sub-admin/apiRoute';
import { DeleteIconBox, EditIconBox, FlexWrapper } from '../../theme/common_style';
import { DeleteIcon, EditIcon, TrashIconNew } from '../../theme/SvgIcons';
import { checkPermission, decryptToken } from '../../utils/common_functions';
import { StickyBox } from '../../utils/style';
import UpdatePassword from '../employees/view-employee/modals/UpdatePassword';
import ActivitySubAdmin from './ActivitySubAdmin';
import AddSubAdmin from './AddSubAdmin';
import SubAdminDetails from './SubAdminDetails';

function SubAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [updatePassModal, setUpdatePassModal] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({});
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editDetails, setEditDetails] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);
  const activityDrawer = useSelector((state) => state?.sidebar?.isActivityDrawer);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const { loggedUserType } = useSelector((state) => state?.userInfo);
  const canCreate = checkPermission('SubAdmin', 'create', permissions);
  const canDelete = checkPermission('SubAdmin', 'del', permissions);
  const canUpdate = checkPermission('SubAdmin', 'update', permissions);

  const sortKeys = {
    account_email: 'account.email',
    role_role: 'role.role',
    account_created_at: 'account.created_at'
  };

  const handleGetListing = async () => {
    try {
      setLoading(true);

      let params = new URLSearchParams();
      debouncedSearch && params.append('search', debouncedSearch);
      sort?.sortBy && params.append('sort_by', sortKeys?.[sort.sortBy]);
      sort?.orderBy && params.append('sort_order', sort?.orderBy);

      const res = await GetAdminListing(params);
      if (res?.statusCode === 200) {
        setDataSource(res?.data);
      } else {
        toast.error(res?.message || 'Something went wrong!');
      }
    } catch (error) {
      toast.error(error || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const debounce = (func, timeOut = 400) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, timeOut);
    };
  };

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val) => {
        setDebouncedSearch(val);
      }, 400),
    []
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    debouncedSetSearch(value);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await DeleteAdminApi(editDetails?.account_id);
      if (res?.statusCode === 200) {
        handleGetListing();
        setDeleteModal(false);
        setEditDetails(null);
        toast.success(res?.message || 'Sub-Admin deleted successfully');
      } else {
        toast.error(res?.message || 'Something went wrong!');
      }
    } catch (error) {
      toast.error(error || 'Something went wrong!');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      title: 'S.NO',
      dataIndex: 'key',
      key: 'key',
      render: (_, __, i) => <span>{i + 1}.</span>
    },
    {
      title: 'Email',
      dataIndex: 'account_email',
      key: 'account_email',
      sorter: true,
      sortOrder:
        sort?.sortBy === 'account_email' ? (sort?.orderBy === 'ASC' ? 'ascend' : 'descend') : null
    },
    {
      title: 'Password',
      dataIndex: 'account_password',
      key: 'account_password',
      render: (pass) => {
        return (
          <Input.Password
            readOnly
            value={decryptToken(pass)}
            style={{
              width: '150px',
              border: 'none',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              cursor: 'default',
              padding: 0
            }}
          />
        );
      }
    },
    {
      title: 'Role',
      dataIndex: 'role_role',
      key: 'role_role',
      sorter: true,
      sortOrder:
        sort?.sortBy === 'role_role' ? (sort?.orderBy === 'ASC' ? 'ascend' : 'descend') : null,
      render: (role, data) => (
        <span
          onClick={() => {
            navigate(`/roles/role/${data.role_id}`, {
              state: { role: data?.role_role, members: data?.role_user_count }
            });
          }}
          style={{ textTransform: 'capitalize', fontWeight: 500, cursor: 'pointer' }}>
          {role}
        </span>
      )
    },
    {
      title: 'Create Date',
      dataIndex: 'account_created_at',
      key: 'account_created_at',
      sorter: true,
      sortOrder:
        sort?.sortBy === 'account_created_at'
          ? sort?.orderBy === 'ASC'
            ? 'ascend'
            : 'descend'
          : null,
      render: (date) => (date ? dayjs(date)?.format('DD MMM, YYYY') : 'N/A')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      className: 'action-column',
      render: (_, record) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="pointer">
            <EditIconBox
              canUpdate={canUpdate}
              onClick={() => {
                if (canUpdate) {
                  setAddModal(true);
                  setEditDetails(record);
                }
              }}>
              <EditIcon />
            </EditIconBox>
            <DeleteIconBox
              canDelete={loggedUserType?.id === record?.account_id ? false : canDelete}
              onClick={() => {
                if (canDelete && loggedUserType?.id !== record?.account_id) {
                  setDeleteModal(true);
                  setEditDetails(record);
                }
              }}>
              <DeleteIcon />
            </DeleteIconBox>
          </FlexWrapper>
        );
      }
    }
  ];

  const handleSorting = (val) => {
    if (val?.columnKey && val?.order) {
      const order = val.order === 'ascend' ? 'ASC' : 'DESC';
      setSort({
        sortBy: val.columnKey,
        orderBy: order
      });
    }
  };

  useEffect(() => {
    handleGetListing();
  }, [debouncedSearch, sort]);

  return (
    <div style={{ position: 'relative' }}>
      {updatePassModal && (
        <UpdatePassword open={updatePassModal} onClose={() => setUpdatePassModal(false)} />
      )}
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Employee'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this Sub Admin?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      {viewDetails && (
        <SubAdminDetails
          open={viewDetails}
          onClose={() => {
            setEditDetails(null);
            setViewDetails(false);
          }}
          viewData={editDetails}
        />
      )}
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
          <ActivitySubAdmin />
        </Drawer>
      )}
      {addModal && (
        <AddSubAdmin
          open={addModal}
          onClose={() => {
            setAddModal(false);
            setEditDetails(null);
          }}
          editDetails={editDetails}
          handleListing={handleGetListing}
        />
      )}
      <StickyBox>
        <FlexWrapper width={'100%'} justify={'space-between'} gap="16px">
          {canCreate && (
            <FlexWrapper justify={'start'} gap="12px">
              <Button prefixCls="antCustomBtn" onClick={() => setAddModal(true)}>
                + Add New Sub-Admin
              </Button>
            </FlexWrapper>
          )}
          <FlexWrapper justify={'end'} gap="6px">
            <SearchField
              placeholder="Search by Email, Role..."
              style={{ width: '250px' }}
              onChange={handleSearchChange}
              value={search}
              allowClear={true}
            />
          </FlexWrapper>
        </FlexWrapper>
      </StickyBox>

      <Table
        prefixCls="antCustomTable"
        columns={columns}
        dataSource={dataSource || []}
        pagination={false}
        onChange={(_, __, sorter) => {
          if (!sorter.order) {
            setSort({});
          } else {
            handleSorting(sorter);
          }
        }}
        defaultSortOrder={sort?.order}
        loading={{ spinning: loading, indicator: TableLoader }}
      />
    </div>
  );
}
export default SubAdmin;
