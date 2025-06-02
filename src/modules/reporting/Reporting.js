import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Input, Pagination, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import dayjs from 'dayjs';
import { ClickWrapper, FlexWrapper, PaginationBox, ViewIconBox } from '../../theme/common_style';
import EmptyData from '../../components/common/EmptyData';
import CreateReport from './CreateReport';
import { getAllReports } from '../../services/api_collection';
import {
  checkPermission,
  currentModule,
  debounce,
  generateEmployeeImgUrl,
  getFullName
} from '../../utils/common_functions';
import ReportingFilters from './ReportingFilters';
import TableLoader from '../../components/loaders/TableLoader';
import { StickyBox } from '../../utils/style';
import { AvatarGroup } from '../../components/common/AvatarGroup';
import {
  FilterIconNew,
  ReportNotFoundIcon,
  SearchIconNew,
  ViewIconNew
} from '../../theme/SvgIcons';
import { actionTypeEnums } from '../../utils/constant';

const Reporting = () => {
  const { isEmployee } = useSelector((e) => e.userInfo);
  const { user_details } = useSelector((e) => e.userInfo?.data);
  const [appliedFilter, setAppliedFilter] = useState({});
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const [filtersModal, setFiltersModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const navigate = useNavigate();

  let permissionSection = currentModule();
  const canCreate = checkPermission(permissionSection, actionTypeEnums.CREATE, permissions);

  const handleGetList = async (search) => {
    try {
      setLoading(true);
      let params = new URLSearchParams();
      params.append('limit', limit);
      params.append('page', page);
      search && params.append('search', search);
      sort?.sortBy && params.append('sortBy', sort?.sortBy);
      sort?.orderBy && params.append('sortOrder', sort?.orderBy);
      Object?.entries(appliedFilter || {}).forEach(([key, value]) => {
        if (value) {
          if (key === 'date') {
            if (key === 'date') {
              value?.[0] && params.append('startDate', dayjs(value[0]).format('YYYY-MM-DD'));
              value?.[1] && params.append('endDate', dayjs(value[1]).format('YYYY-MM-DD'));
            }
          } else {
            params.append(key, value?.toString());
          }
        }
      });
      isEmployee && params.append('empId', user_details?.id);
      const res = await getAllReports(params);
      if (res?.statusCode === 200) {
        let array = (res?.data?.reportings || [])?.map((el, idx) => ({
          ...el,
          key: idx + 1
        }));
        setData(array || []);
        setTotal(res?.data?.pagination?.total);
      } else toast.error(res?.message || 'Something went wrong');
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const optimizedFn = useCallback(debounce(handleGetList), [appliedFilter, page, sort]);

  const columns = isEmployee
    ? [
        {
          title: 'S.NO',
          dataIndex: 'key',
          key: 'key',
          render: (text) => <span>{text}.</span>
        },
        {
          title: 'Date',
          dataIndex: 'reporting_date',
          key: 'reporting_date',
          sorter: true,
          sortOrder:
            sort?.sortBy === 'reporting_date'
              ? sort?.orderBy === 'ASC'
                ? 'ascend'
                : 'descend'
              : null,
          render: (date, data) =>
            date || data?.created_at
              ? moment(date || data?.created_at).format('DD MMM, YYYY')
              : '—' || '—'
        },
        {
          title: 'Project',
          dataIndex: 'project',
          key: 'project',
          render: (project) => (
            <ClickWrapper
              style={{ fontWeight: 500, cursor: 'pointer' }}
              onClick={() => {
                navigate(`/project/details/${project?.id}`, {
                  state: { project: project }
                });
              }}>
              {project ? project?.name : '—' || '—'}
            </ClickWrapper>
          )
        },
        {
          title: 'Billable',
          dataIndex: 'billable_hours',
          key: 'billable_hours',
          render: (billable_hours, data) => (
            <span>
              {data?.billable
                ? billable_hours?.length > 0
                  ? billable_hours + ' Hrs'
                  : 'No'
                : 'No'}
            </span>
          )
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          className: 'action-column',
          render: (_, record) => {
            return (
              <ClickWrapper
                onClick={() =>
                  navigate(`/view-report/${record?.id}`, {
                    state: {
                      empId: record?.emp_reporting_id?.id,
                      date: record?.reporting_date || record?.created_at,
                      report: record
                    }
                  })
                }>
                <ViewIconBox style={{ cursor: 'pointer' }}>
                  <ViewIconNew />
                </ViewIconBox>
              </ClickWrapper>
            );
          }
        }
      ]
    : [
        {
          title: 'S.NO',
          dataIndex: 'key',
          key: 'key',
          render: (text) => <span>{text}.</span>
        },
        {
          title: 'Emp Name',
          dataIndex: 'emp_reporting_id',
          key: 'emp_reporting_id',
          render: (user) => {
            let empData = [
              {
                name: user?.first_name,
                src: generateEmployeeImgUrl(user?.id),
                id: user?.id,
                completionColor: user?.profile_completion
              }
            ];
            return (
              <ClickWrapper
                onClick={() =>
                  navigate(`/view-employee/${user?.id}`, {
                    state: {
                      name: getFullName(user?.first_name, user?.middle_name, user?.last_name)
                    }
                  })
                }>
                <FlexWrapper justify={'start'} cursor={'pointer'} gap={'6px'} wrap={'unset'}>
                  <AvatarGroup avatars={empData} />
                  <span style={{ fontWeight: 500 }}>
                    {getFullName(user?.first_name, user?.middle_name, user?.last_name)}
                  </span>
                </FlexWrapper>
              </ClickWrapper>
            );
          }
        },
        {
          title: 'Department',
          dataIndex: 'emp_reporting_id',
          key: 'emp_reporting_id',
          render: (emp_reporting_id) => (
            <span>{emp_reporting_id ? emp_reporting_id?.department : '—' || '—'}</span>
          )
        },
        {
          title: 'Date',
          dataIndex: 'reporting_date',
          key: 'reporting_date',
          sorter: true,
          sortOrder:
            sort?.sortBy === 'reporting_date'
              ? sort?.orderBy === 'ASC'
                ? 'ascend'
                : 'descend'
              : null,
          render: (date, data) =>
            date || data?.created_at
              ? moment(date || data?.created_at).format('DD MMM, YYYY')
              : '—' || '—'
        },
        {
          title: 'Project',
          dataIndex: 'project',
          key: 'project',
          render: (project) => (
            <ClickWrapper
              onClick={() => {
                navigate(`/project/details/${project?.id}`, {
                  state: { project: project }
                });
              }}>
              <span style={{ fontWeight: 500, cursor: 'pointer' }}>
                {project ? project?.name : '—' || '—'}
              </span>
            </ClickWrapper>
          )
        },
        {
          title: 'Billable',
          dataIndex: 'billable_hours',
          key: 'billable_hours',
          render: (billable_hours, data) => (
            <span>
              {' '}
              {data?.billable
                ? billable_hours?.length > 0
                  ? billable_hours + ' Hrs'
                  : 'No'
                : 'No'}
            </span>
          )
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          className: 'action-column',
          render: (_, record) => {
            return (
              <ClickWrapper
                onClick={() =>
                  navigate(`/view-report/${record?.id}`, {
                    state: {
                      empId: record?.emp_reporting_id?.id,
                      date: record?.reporting_date || record?.created_at,
                      report: record
                    }
                  })
                }>
                <ViewIconBox style={{ cursor: 'pointer' }}>
                  <ViewIconNew />
                </ViewIconBox>
              </ClickWrapper>
            );
          }
        }
      ];

  const handlePageChange = (page) => {
    setPage(page);
  };

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
    if (search !== null) {
      optimizedFn(search);
    } else {
      handleGetList();
    }
  }, [page, search, appliedFilter, sort]);

  return (
    <div>
      {filtersModal && (
        <ReportingFilters
          setAppliedFilter={setAppliedFilter}
          appliedFilter={appliedFilter}
          open={filtersModal}
          onClose={() => setFiltersModal(false)}
        />
      )}
      <StickyBox padding="8px">
        <FlexWrapper
          width={'100%'}
          justify={isEmployee && canCreate ? 'space-between' : 'end'}
          gap="16px"
          cursor="default"
          style={{ marginBottom: '16px' }}>
          {createModal && (
            <CreateReport
              open={createModal}
              onCancel={() => setCreateModal(false)}
              handleList={handleGetList}
            />
          )}

          {isEmployee && canCreate && (
            <Button
              type="text"
              prefixCls="antCustomBtn"
              onClick={() => {
                if (isEmployee) {
                  setCreateModal(true);
                }
              }}>
              Add New Report
            </Button>
          )}

          <FlexWrapper justify={'center'} gap="6px" cursor="default">
            <Input
              prefixCls="antCustomInput"
              placeholder="Search by Project Name..."
              prefix={<SearchIconNew />}
              style={{ width: '240px' }}
              onChange={(e) => setSearch(e?.target?.value.trim())}
            />
            <Badge
              count={Object?.values(appliedFilter || {})?.reduce(
                (acc, item) =>
                  acc +
                  (item
                    ? Array.isArray(item)
                      ? item?.length > 0 && item?.[0] !== null
                        ? 1
                        : 0
                      : 1
                    : 0),
                0
              )}
              color="#7c71ff"
              offset={[-9, 4]}
              prefixCls="filterBadge">
              <Button prefixCls="custom-filter-btn" onClick={() => setFiltersModal(true)}>
                <FilterIconNew /> Filter
              </Button>
            </Badge>
          </FlexWrapper>
        </FlexWrapper>
      </StickyBox>

      {data.length > 0 || loading ? (
        <Table
          prefixCls="antCustomTable"
          dataSource={data}
          columns={columns}
          pagination={false}
          onChange={(_, __, sorter) => {
            if (!sorter.order) {
              setSort({});
            } else {
              handleSorting(sorter);
            }
          }}
          defaultSortOrder={sort.order}
          loading={{ spinning: loading, indicator: TableLoader }}
        />
      ) : (
        <EmptyData
          height={'70vh'}
          icon={<ReportNotFoundIcon />}
          title={'No Report'}
          subTitle={'No Report Found'}
        />
      )}
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

export default Reporting;
