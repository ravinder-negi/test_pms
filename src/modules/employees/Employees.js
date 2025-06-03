import React, { useCallback, useEffect, useState } from 'react';
import { DeleteIconBox, FlexWrapper, PaginationBox, ViewIconBox } from '../../theme/common_style';
import { Button, Drawer, Pagination, Table } from 'antd';
import { DeleteIcon, TrashIconNew, ViewIconNew } from '../../theme/SvgIcons';
import {
  checkPermission,
  debounce,
  generateEmployeeImgUrl,
  getFullName
} from '../../utils/common_functions';
import { useDispatch, useSelector } from 'react-redux';
import SearchField from '../../components/searchField/SearchField';
import TableLoader from '../../components/loaders/TableLoader';
import CreateEmployees from './CreateEmployees';
import ActivityEmployee from './ActivityEmployee';
import UploadEmployee from './UploadEmployee';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteEmployeeApi, getEmployeeApi } from '../../redux/employee/apiRoute';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import FilterDrawer from './FilterDrawer';
import { updateActivityDrawer } from '../../redux/sidebar/SidebarSlice';
import { StickyBox } from '../../utils/style';
import { AvatarGroup } from '../../components/common/AvatarGroup';
import FilterButton from '../../components/common/FilterButton';
import { useCurrentModule } from '../../hooks/useCurrentModule';

const Employees = () => {
  const { permissions, user_details } = useSelector((state) => state?.userInfo?.data);
  const moduleName = useCurrentModule();
  const canCreate = checkPermission(moduleName, 'create', permissions);
  const canDelete = checkPermission(moduleName, 'del', permissions);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editDetails, setEditDetails] = useState(null);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const appliedFilter = useSelector((state) => state?.employeeSlice?.filterData);
  const activityDrawer = useSelector((state) => state?.sidebar?.isActivityDrawer);
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'S.NO',
      dataIndex: 'key',
      key: 'key',
      render: (text) => <span>{(page - 1) * limit + text}.</span>
    },
    {
      title: 'Emp Name',
      dataIndex: 'first_name',
      key: 'user',
      render: (_, data) => {
        const empName = getFullName(data?.first_name, data?.middle_name, data?.last_name);
        const empData = [
          {
            name: empName,
            src: generateEmployeeImgUrl(data?.id),
            id: data?.id,
            completionColor: data?.profile_completion
          }
        ];
        return (
          <FlexWrapper
            justify={'start'}
            gap={'6px'}
            wrap={'unset'}
            onClick={() =>
              navigate(`/view-employee/${data?.id}`, {
                state: { name: empName }
              })
            }>
            <AvatarGroup avatars={empData} />
            <span style={{ fontWeight: 500 }}>{empName}</span>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Emp Code',
      dataIndex: 'emp_code',
      key: 'emp_code'
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      render: (designation) => <span>{designation || 'N/A'}</span>
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => <span>{department || 'N/A'}</span>
    },
    {
      title: 'No of Projects',
      dataIndex: 'projectcount',
      key: 'projectcount'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return (
          <FlexWrapper
            width="fit-content"
            style={{
              backgroundColor: `${status === 'Active' ? '#FAFFDE' : '#FFDEE6'}`,
              padding: '6px 12px',
              color: `${status === 'Active' ? '#5EB85C' : '#FB4A49'}`,
              textWrap: 'nowrap',
              borderRadius: '100px',
              fontSize: '12px'
            }}>
            {status}
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      className: 'action-column',
      render: (_, record) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="pointer">
            <ViewIconBox
              onClick={() =>
                navigate(`/view-employee/${record?.id}`, {
                  state: {
                    name: getFullName(record?.first_name, record?.middle_name, record?.last_name)
                  }
                })
              }>
              <ViewIconNew />
            </ViewIconBox>

            {canDelete && (
              <DeleteIconBox
                canDelete={user_details?.id === record?.id ? false : canDelete}
                onClick={() => {
                  if (canDelete && user_details?.id !== record?.id) {
                    setDeleteModal(true);
                    setEditDetails(record);
                  }
                }}>
                <DeleteIcon />
              </DeleteIconBox>
            )}
          </FlexWrapper>
        );
      }
    }
  ];
  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleGetAllEmployees = async (search) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit, ...(search && { search }) });
      Object.entries(appliedFilter || {}).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await getEmployeeApi(params);
      if (res?.statusCode === 200) {
        setTotal(res?.data?.total);
        setDataSource(
          res?.data?.list?.map((el, idx) => ({
            ...el,
            key: idx + 1,
            role: el?.role_id?.role
          }))
        );
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setEditDetails(null);
    }
  };

  const optimizedFn = useCallback(debounce(handleGetAllEmployees), [appliedFilter]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await deleteEmployeeApi(editDetails?.id);
      if (res?.statusCode === 200) {
        toast.success('Employee deleted successfully');
        handleGetAllEmployees();
        setDeleteModal(false);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (search !== null) {
      optimizedFn(search);
    } else {
      handleGetAllEmployees();
    }
  }, [search, page, appliedFilter]);

  return (
    <div style={{ position: 'relative' }}>
      {filterDrawer && <FilterDrawer open={filterDrawer} onClose={() => setFilterDrawer(false)} />}
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title="Delete Employee"
          onSubmit={handleDelete}
          buttonName="Delete"
          description="Are you sure you want to delete this employee?"
          iconBG="#FB4A49"
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      {uploadModal && <UploadEmployee open={uploadModal} onClose={() => setUploadModal(false)} />}
      {activityDrawer && (
        <Drawer
          width={490}
          title="Activity"
          placement="right"
          closable
          prefixCls="activityCustomDrawer"
          onClose={() => dispatch(updateActivityDrawer(false))}
          open={activityDrawer}>
          <ActivityEmployee />
        </Drawer>
      )}
      {createModal && (
        <CreateEmployees
          open={createModal}
          onClose={() => setCreateModal(false)}
          handleGetAllEmployees={handleGetAllEmployees}
        />
      )}
      <StickyBox>
        <FlexWrapper width="100%" justify={canCreate ? 'space-between' : 'end'} gap="16px">
          {canCreate && (
            <Button prefixCls="antCustomBtn" onClick={() => setCreateModal(true)}>
              + Add New Employee
            </Button>
          )}
          <FlexWrapper justify="end" gap="6px">
            <SearchField
              placeholder="Search by Emp Name..."
              style={{ width: '250px' }}
              onChange={setSearch}
              allowClear
              value={search}
            />
            <FilterButton handleClick={setFilterDrawer} appliedFilter={appliedFilter} />
          </FlexWrapper>
        </FlexWrapper>
      </StickyBox>
      <Table
        prefixCls="antCustomTable"
        columns={columns}
        dataSource={dataSource || []}
        pagination={false}
        loading={{ spinning: loading, indicator: TableLoader }}
      />
      {total > limit && (
        <PaginationBox>
          <Pagination
            current={page}
            prefixCls="custom-pagination"
            pageSize={limit}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </PaginationBox>
      )}
    </div>
  );
};

export default Employees;
