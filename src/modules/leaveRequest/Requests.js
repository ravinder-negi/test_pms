import React, { useCallback, useEffect, useState } from 'react';
import { FlexWrapper, PaginationBox } from '../../theme/common_style';
import { Badge, Button, Pagination, Segmented, Table } from 'antd';
import { FilterIconNew, NoLeaveIcon, ViewIconNew } from '../../theme/SvgIcons';
import SearchField from '../../components/searchField/SearchField';
import { useNavigate } from 'react-router-dom';
import EmptyData from '../../components/common/EmptyData';
import { useSelector } from 'react-redux';
import { GetLeaveRequests } from '../../redux/lms/apiRoute';
import { toast } from 'react-toastify';
import AvatarImage from '../../components/common/AvatarImage';
import {
  debounce,
  getCategory,
  getFullName,
  getSlot,
  getStatusTag,
  useWindowWide
} from '../../utils/common_functions';
import RequestFilter from './RequestFilter';
import { StickyBox } from '../../utils/style';
import { LeaveTabOptions } from '../../utils/constant';

const Requests = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState();
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const largeScreen = useWindowWide(1085);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sort, setSort] = useState({});
  const navigate = useNavigate();
  const { data } = useSelector((e) => e.userInfo);

  const fetchData = async (search) => {
    const params = new URLSearchParams();
    console.log(sort, 'sort');
    params.append('employee_id', data?.user_details?.id);
    params.append('page', page);
    params.append('limit', limit);
    params.append('filter', activeTab);
    sort?.sortBy && params.append('sort_by', sort?.sortBy);
    sort?.orderBy && params.append('sort_order', sort?.orderBy);
    search && params.append('search', search);
    if (Object.keys(filterData || {}).length > 0) {
      Object.entries(filterData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
    }
    setLoading(true);
    try {
      const res = await GetLeaveRequests(params);
      if (res?.statusCode === 200) {
        setApiData(res?.data?.leaves);
        setTotal(res?.data?.total);
      } else toast.error(res?.message || 'Something went wrong');
    } catch (error) {
      toast.error(error || 'Something went wrong');
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
          <FlexWrapper
            onClick={() => {
              navigate(`/requests/details/${data?.id}`, {
                state: { lms: data }
              });
            }}
            cursor="pointer"
            style={{
              backgroundColor: '#7C71FF',
              width: '30px',
              height: '30px',
              borderRadius: '50%'
            }}>
            <ViewIconNew />
          </FlexWrapper>
        );
      }
    }
  ];

  const optimizedFn = useCallback(debounce(fetchData), [data, activeTab, page, filterData, sort]);

  useEffect(() => {
    if (search !== null) {
      optimizedFn(search);
    } else {
      fetchData();
    }
  }, [data, search, activeTab, page, filterData, sort]);

  return (
    <div>
      {filterDrawer && (
        <RequestFilter
          open={filterDrawer}
          onClose={() => setFilterDrawer(false)}
          activeTab={activeTab}
          filterData={filterData}
          setFilterData={setFilterData}
        />
      )}
      <StickyBox padding="8px 0">
        <FlexWrapper
          width={'100%'}
          justify={largeScreen ? 'space-between' : 'center'}
          gap="16px"
          cursor="default"
          style={{
            marginBottom: '16px'
          }}>
          <FlexWrapper justify="start">
            <Segmented
              prefixCls="antCustomSegmented"
              options={LeaveTabOptions}
              onChange={(value) => {
                setActiveTab(value);
              }}
            />
          </FlexWrapper>

          <FlexWrapper justify={'end'} gap="6px" cursor="default">
            <SearchField
              placeholder="Search by Leave type..."
              style={{ width: '250px' }}
              value={search}
              onChange={setSearch}
            />
            <Badge
              count={Object?.values(filterData || {})?.reduce(
                (acc, item) => acc + (item ? 1 : 0),
                0
              )}
              color="#7c71ff"
              offset={[-9, 4]}
              prefixCls="filterBadge">
              <Button prefixCls="custom-filter-btn" onClick={() => setFilterDrawer(true)}>
                <FilterIconNew /> Filter
              </Button>
            </Badge>
          </FlexWrapper>
        </FlexWrapper>
      </StickyBox>
      {loading || apiData?.length > 0 ? (
        <>
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
        </>
      ) : (
        <EmptyData
          height={'50vh'}
          icon={<NoLeaveIcon />}
          title={'No Leave Requests'}
          subTitle={'There are no leave requested.'}
        />
      )}
    </div>
  );
};

export default Requests;
