import React, { useCallback, useEffect, useState } from 'react';
import { FlexWrapper, PaginationBox } from '../../theme/common_style';
import { Badge, Button, Pagination, Segmented, Table } from 'antd';
import { FilterIconNew, NoLeaveIcon, Plusicon, ViewIconNew } from '../../theme/SvgIcons';
import SearchField from '../../components/searchField/SearchField';
import { useNavigate } from 'react-router-dom';
import AddLeave from './AddLeave';
import EmptyData from '../../components/common/EmptyData';
import EmployeeCard from './EmployeeCard';
import { useDispatch, useSelector } from 'react-redux';
import { GetEmployeeLeavesApi, GetLeavesListingApi } from '../../redux/lms/apiRoute';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import {
  checkPermission,
  debounce,
  getCategory,
  getFullName,
  getSlot,
  getStatusTag,
  useWindowWide
} from '../../utils/common_functions';
import AvatarImage from '../../components/common/AvatarImage';
import { StickyBox } from '../../utils/style';
import colors from '../../theme/colors';
import { LeaveTabOptions } from '../../utils/constant';
import { updateLmsTab } from '../../redux/lms/LmsSlice';

const LmsDetails = ({ updateGraph, setFilterDrawer, appliedFilter }) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState();
  const activeTab = useSelector((state) => state?.LmsSlice?.LmsTab);
  const [limit, setLimit] = useState(20);
  const [addModal, setAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const largeScreen = useWindowWide(1085);
  const anotherlargeScreen = useWindowWide(820);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isEmployee, data } = useSelector((e) => e.userInfo);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'LMS';
  const [sort, setSort] = useState({});
  const canCreate = checkPermission(permissionSection, 'create', permissions);

  const fetchData = (search) => {
    const params = new URLSearchParams();
    console.log(sort, 'sort');
    params.append('page', page);
    params.append('limit', limit);
    params.append('filter', activeTab);
    sort?.sortBy && params.append('sort_by', sort?.sortBy);
    sort?.orderBy && params.append('sort_order', sort?.orderBy);
    search && params.append('search', search);
    if (Object.keys(appliedFilter || {}).length > 0) {
      Object.entries(appliedFilter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
    }
    const id = data?.user_details?.id;
    if (!isEmployee) {
      getLmsAdmin(params);
    } else {
      getLmsEmployee(params, id);
    }
  };

  const getLmsEmployee = async (payload, id) => {
    setLoading(true);
    try {
      const res = await GetEmployeeLeavesApi(payload, id);
      if (res?.statusCode == 200) {
        setApiData(res?.data?.leaves);
        setTotal(res?.data?.total);
      } else toast.error(res?.message || 'Something went wrong');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getLmsAdmin = async (payload) => {
    setLoading(true);
    try {
      const res = await GetLeavesListingApi(payload);
      if (res?.statusCode === 200) {
        setApiData(res?.data?.leaves);
        setTotal(res?.data?.totalLeaves);
      } else toast.error(res?.message || 'Something went wrong');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSorting = (val) => {
    if (val?.field) {
      let order = val?.order == 'ascend' ? 'ASC' : 'DESC';
      setSort({ sortBy: val?.columnKey, orderBy: order, ...val });
    }
    setPage(page);
    setLimit(20);
  };

  const columns = [
    {
      title: 'Emp Name',
      dataIndex: 'employee',
      key: 'employee_name',
      sorter: true,
      render: (employee) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
            <AvatarImage
              style={{
                height: '32px',
                width: '32px',
                minWidth: '32px',
                fontSize: '16px'
              }}
              image={
                process.env.REACT_APP_S3_BASE_URL + 'employee/profileImg/' + employee?.id + '.jpg'
              }
              name={getFullName(employee?.first_name, employee?.middle_name, employee?.last_name)}
            />

            <span style={{ whiteSpace: 'nowrap' }}>{employee?.first_name}</span>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Emp ID',
      dataIndex: 'employee',
      key: 'employee_id',
      sorter: true,
      render: (employee) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
            <span style={{ whiteSpace: 'nowrap' }}>{employee?.id}</span>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Role',
      dataIndex: 'employee',
      key: 'employee',
      render: (employee) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
            <span style={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
              {employee?.role_id?.role}
            </span>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Leave Type',
      dataIndex: 'leave_type',
      key: 'leave_type',
      render: (leave_type) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
            <span style={{ whiteSpace: 'nowrap' }}>{leave_type}</span>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      sorter: true,
      render: (startDate) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
            <span style={{ whiteSpace: 'nowrap' }}>{startDate}</span>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      sorter: true,
      render: (endDate) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
            <span style={{ whiteSpace: 'nowrap' }}>{endDate}</span>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Leave Category',
      dataIndex: 'leave_category',
      key: 'leave_category',
      render: (leave_category) => getCategory(leave_category) ?? 'N/A'
    },
    {
      title: 'Leave Slot',
      dataIndex: 'leave_slot',
      key: 'leave_slot',
      render: (leave_slot) => getSlot(leave_slot) ?? 'N/A'
    },
    {
      title: 'Status',
      dataIndex: 'leave_status',
      key: 'leave_status',
      render: (status) => getStatusTag(status)
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      className: 'action-column',
      render: (_, data) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'}>
            <FlexWrapper
              onClick={() => {
                navigate(`/lms/details/${data?.id}`, {
                  state: { lms: data }
                });
              }}
              cursor={'pointer'}
              style={{
                backgroundColor: '#7C71FF',
                width: '30px',
                height: '30px',
                borderRadius: '50%'
              }}>
              <ViewIconNew />
            </FlexWrapper>
          </FlexWrapper>
        );
      }
    }
  ];

  const optimizedFn = useCallback(debounce(fetchData), [
    data,
    activeTab,
    page,
    appliedFilter,
    sort
  ]);

  useEffect(() => {
    if (search !== null) {
      console.log(search, 'search');
      optimizedFn(search);
    } else {
      fetchData();
    }
  }, [data, search, activeTab, page, appliedFilter, sort]);

  return (
    <div style={{ marginTop: '20px' }}>
      {addModal && (
        <AddLeave
          open={addModal}
          onClose={() => setAddModal(false)}
          fetchData={fetchData}
          updateGraph={updateGraph}
        />
      )}
      <StickyBox padding="8px 0">
        <FlexWrapper
          width={'100%'}
          justify={largeScreen ? 'space-between' : 'center'}
          align={'center'}
          gap="16px"
          cursor="default"
          style={{
            marginBottom: '16px'
          }}>
          <FlexWrapper justify="start">
            <Segmented
              value={activeTab}
              prefixCls="antCustomSegmented"
              options={LeaveTabOptions}
              onChange={(value) => {
                dispatch(updateLmsTab(value));
              }}
            />
          </FlexWrapper>

          <FlexWrapper justify={largeScreen ? 'end' : 'center'} gap="6px" cursor="default">
            <SearchField
              placeholder="Search by Leave type..."
              style={{ width: '250px' }}
              value={search}
              onChange={setSearch}
              allowClear={true}
            />
            <Badge
              count={Object?.values(appliedFilter || {})?.reduce(
                (acc, item) => acc + (item ? 1 : 0),
                0
              )}
              color="#7c71ff"
              offset={[-9, 4]}
              prefixCls="filterBadge">
              <Button prefixCls="custom-filter-btn" onClick={() => setFilterDrawer(true)}>
                <FilterIconNew /> {anotherlargeScreen && 'Filter'}
              </Button>
            </Badge>
            {canCreate && isEmployee && (
              <Button
                type="text"
                onClick={() => setAddModal(true)}
                style={{
                  width: anotherlargeScreen ? '164px' : '50px',
                  height: '40px',
                  padding: '3px 10px',
                  borderRadius: '7px',
                  fontWeight: '500',
                  fontSize: '14px',
                  fontFamily: 'Plus Jakarta Sans',
                  background: '#7C71FF',
                  color: 'white',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                <Plusicon fill={colors.white} w="15" h="15" />
                {anotherlargeScreen && 'Add Leave'}
              </Button>
            )}
          </FlexWrapper>
        </FlexWrapper>
      </StickyBox>
      {!isEmployee ? (
        loading || apiData?.length > 0 ? (
          <div style={{ width: '100%' }}>
            <Table
              prefixCls="antCustomTable"
              columns={columns}
              dataSource={apiData}
              pagination={false}
              loading={loading}
              onChange={(newPagination, filters, sorter) => {
                if (!sorter.order) {
                  setSort({});
                } else {
                  handleSorting(sorter);
                }
                console.log(newPagination, filters, sorter);
              }}
              defaultSortOrder={sort.order}
            />
            {total > limit && (
              <PaginationBox>
                <Pagination
                  current={page}
                  prefixCls="custom-pagination"
                  pageSize={limit}
                  total={total}
                  onChange={(e) => setPage(e)}
                  showSizeChanger={false}
                />
              </PaginationBox>
            )}
          </div>
        ) : (
          <EmptyData
            height={'50vh'}
            icon={<NoLeaveIcon />}
            title={'No Leave'}
            subTitle={`There are no leave requested.`}
          />
        )
      ) : loading || apiData?.length > 0 ? (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {apiData?.map((item, index) => (
              <EmployeeCard item={item} key={index} loading={loading} />
            ))}
          </div>
          {total > limit && (
            <PaginationBox>
              <Pagination
                current={page}
                prefixCls="custom-pagination"
                pageSize={limit}
                total={total}
                onChange={(e) => setPage(e)}
                showSizeChanger={false}
              />
            </PaginationBox>
          )}
        </div>
      ) : (
        <EmptyData
          height={'50vh'}
          icon={<NoLeaveIcon />}
          title={'No Leave'}
          subTitle={`There are no leave requested.`}
        />
      )}
    </div>
  );
};

export default LmsDetails;

LmsDetails.propTypes = {
  updateGraph: PropTypes.func.isRequired,
  setFilterDrawer: PropTypes.func.isRequired,
  appliedFilter: PropTypes.object
};
