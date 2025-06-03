import React, { useCallback, useEffect, useState } from 'react';
import {
  CardContent,
  DeleteIconBox,
  FlexWrapper,
  GridBox,
  PaginationBox,
  ViewIconBox
} from '../../theme/common_style';
import ProjectCard from '../../components/projects/ProjectCard';
import Title from 'antd/es/typography/Title';
import {
  DeleteIcon,
  FilterIconNew,
  HmsCardIcon1,
  HmsCardIcon2,
  HmsCardIcon3,
  HmsCardIcon4,
  HmsCardIcon5,
  NoData,
  NoMilestone,
  TrashIconNew,
  ViewIconNew
} from '../../theme/SvgIcons';
import { Badge, Button, Drawer, Pagination, Segmented, Table } from 'antd';
import SearchField from '../../components/searchField/SearchField';
import EmptyData from '../../components/common/EmptyData';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import AddModal from './AddModal';
import { updateActivityDrawer } from '../../redux/sidebar/SidebarSlice';
import { useDispatch, useSelector } from 'react-redux';
import CountUp from 'react-countup';
import HmsFilter from './HmsFilter';
import ActivityEmployee from './ActivityDrawer';
import {
  deleteDevice,
  getAssignDeviceListing,
  getDeviceCounts,
  getDeviceListing,
  returnDevice
} from '../../services/api_collection';
import { toast } from 'react-toastify';
import useDepartmentOptions from '../../hooks/useDepartmentOptions';
import {
  checkPermission,
  debounce,
  generateEmployeeImgUrl,
  getFullName,
  useWindowWide
} from '../../utils/common_functions';
import useDesignationOptions from '../../hooks/useDesignationOptions';
import { AvatarGroup } from '../../components/common/AvatarGroup';
import { StickyBox } from '../../utils/style';
import { hmsTabEnum, HMSTabOptions } from '../../utils/constant';
import { updateHmsTab } from '../../redux/hms/HmsSlice';
import { getStatusTag } from './common';
import dayjs from 'dayjs';

const HMS = () => {
  const activeTab = useSelector((state) => state?.HmsSlice?.HmsTab);
  const [search, setSearch] = useState('');
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeletedId] = useState(null);
  const [returnDeviceData, setReturnDeviceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deviceListing, setDeviceListing] = useState([]);
  const largeScreen = useWindowWide(1085);
  const [filterData, setFilterData] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(20);
  const [countsDetails, setCountsDetail] = useState(null);
  const activityDrawer = useSelector((state) => state?.sidebar?.isActivityDrawer);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const { options: departmentOptions } = useDepartmentOptions();
  const canCreate = checkPermission('HMS', 'create', permissions);
  const canDelete = checkPermission('HMS', 'del', permissions);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [designationOptions, setDesignationOptions] = useState({});
  const [cardLoading, setCardLoading] = useState(false);

  const columns =
    activeTab === hmsTabEnum?.INVENTORY
      ? [
          { title: 'S. NO', dataIndex: 'id', key: 'id', render: (_, __, i) => i + 1 },
          {
            title: 'Device ID',
            dataIndex: 'device_id',
            key: 'device_id',
            render: (id, data) => (
              <span
                style={{ fontWeight: 600, cursor: 'pointer' }}
                onClick={() => {
                  navigate(`/hms/details/${data?.id}`, {
                    state: { hms: data, activeTab: hmsTabEnum?.INVENTORY }
                  });
                }}>
                {id}
              </span>
            )
          },
          {
            title: 'Device Type',
            dataIndex: 'device_type',
            key: 'device_type'
          },
          {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand'
          },
          {
            title: 'Model',
            dataIndex: 'model',
            key: 'model'
          },
          {
            title: 'Serial Number',
            dataIndex: 'serial_number',
            key: 'serial_number'
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status)
          },
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            className: 'action-column',
            render: (_, data) => {
              return (
                <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor={'default'}>
                  <ViewIconBox
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      navigate(`/hms/details/${data?.id}`, {
                        state: { hms: data, activeTab: hmsTabEnum?.INVENTORY }
                      });
                    }}>
                    <ViewIconNew />
                  </ViewIconBox>
                  {canDelete && (
                    <DeleteIconBox
                      canDelete={canDelete}
                      onClick={() => {
                        setDeletedId(data?.id);
                        setDeleteModal(true);
                      }}>
                      <DeleteIcon />
                    </DeleteIconBox>
                  )}
                </FlexWrapper>
              );
            }
          }
        ]
      : activeTab === hmsTabEnum?.ASSIGNEE && [
          { title: 'S. NO', dataIndex: 'id', key: 'id', render: (_, __, i) => i + 1 },
          {
            title: 'Assigned To',
            dataIndex: 'assignee',
            key: 'assignee',

            render: (_, data) => {
              let empName = getFullName(data?.employee?.first_name);
              const imgData = [
                {
                  name: empName,
                  src: generateEmployeeImgUrl(data?.employee?.id),
                  id: data?.employee?.id
                }
              ];
              return (
                <FlexWrapper
                  cursor="pointer"
                  onClick={() => {
                    navigate(`/hms/details/${data?.id}`, {
                      state: { hms: data }
                    });
                  }}
                  wrap="no-wrap"
                  justify={'start'}
                  gap={'6px'}>
                  <AvatarGroup avatars={imgData} />
                  <p style={{ fontSize: '14px', margin: 0 }}>{empName}</p>
                </FlexWrapper>
              );
            }
          },
          {
            title: 'Department',
            dataIndex: 'department',
            key: 'employee',
            render: (_, data) => {
              const matchDepartment = departmentOptions?.find(
                (val) => val?.value == data?.employee?.department
              );
              return <p>{matchDepartment ? matchDepartment?.label : 'N/A'}</p>;
            }
          },
          {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            render: (_, data) => {
              const department = designationOptions[data?.id];
              return <p>{department ? department : 'N/A'}</p>;
            }
          },
          {
            title: 'Device ID',
            dataIndex: 'device_id',
            key: 'device_id',
            render: (id, data) => {
              return <p>{data?.device?.device_id}</p>;
            }
          },
          {
            title: 'Date Assigned',
            dataIndex: 'assign_date',
            key: 'assign_date',
            render: (assign_date) => {
              if (!assign_date || isNaN(Number(assign_date))) return <p>--</p>;
              const date = dayjs(Number(assign_date));
              return <p>{date.format('YYYY-MM-DD')}</p>;
            }
          },
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            className: 'action-column',
            render: (_, data) => {
              return (
                <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor={'default'}>
                  <ViewIconBox
                    onClick={() => {
                      navigate(`/hms/details/${data?.id}`, {
                        state: { hms: data }
                      });
                    }}>
                    <ViewIconNew />
                  </ViewIconBox>
                  {canDelete && (
                    <DeleteIconBox
                      canDelete={canDelete}
                      onClick={() => {
                        setReturnDeviceData(data);
                        setDeleteModal(true);
                      }}>
                      <DeleteIcon />
                    </DeleteIconBox>
                  )}
                </FlexWrapper>
              );
            }
          }
        ];

  const getCountByStatus = (status) => {
    return (
      countsDetails?.data?.find((item) => item.status.toLowerCase() === status.toLowerCase())
        ?.count || 0
    );
  };

  const statsData = [
    {
      icon: <HmsCardIcon1 />,
      bg: '#DDF3FF',
      label: 'Number of Hardware',
      value: countsDetails?.count || 0
    },
    {
      icon: <HmsCardIcon2 />,
      bg: '#E4FFDD',
      label: 'Available',
      value: getCountByStatus('available')
    },
    {
      icon: <HmsCardIcon3 />,
      bg: '#E1E7FF',
      label: 'Assigned',
      value: getCountByStatus('assigned')
    },
    {
      icon: <HmsCardIcon4 />,
      bg: '#FFF3DB',
      label: 'Maintenance',
      value: getCountByStatus('maintenance')
    },
    {
      icon: <HmsCardIcon5 />,
      bg: '#FFCCC8',
      label: 'Retired',
      value: getCountByStatus('retired')
    }
  ];

  const fetchDesignation = async (data) => {
    const res = await useDesignationOptions(data?.employee?.department);
    let designation = res?.find((item) => item?.id == data?.employee?.designation);
    setDesignationOptions((prev) => ({
      ...prev,
      [data?.id]: designation?.designation
    }));
  };

  const handlOnChange = (page, pageSize) => {
    setLimit(pageSize);
    setPage(page);
  };

  const handleGetCounts = async () => {
    setCardLoading(true);
    let res = await getDeviceCounts();
    if (res?.statusCode === 200) {
      setCountsDetail(res);
      setCardLoading(false);
    } else {
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
      setCardLoading(false);
    }
  };

  const handleGetDeviceListing = async (search) => {
    setLoading(true);
    let params = new URLSearchParams();
    params.append('limit', limit);
    params.append('pageNumber', page);
    search && params.append('searchKey', search);
    if (Array.isArray(filterData?.device_type)) {
      filterData?.device_type && params.append('device_type', filterData?.device_type);
    }

    if (Array.isArray(filterData?.status)) {
      filterData?.status && params.append('status', filterData?.status);
    }
    let res = await getDeviceListing(params);
    if (res?.statusCode === 200) {
      setLoading(false);
      setTotal(res?.count);
      setDeviceListing(res?.data);
    } else {
      setLoading(false);
      setDeviceListing([]);
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
    }
  };

  const handlegetAssignDeviceListing = async (search) => {
    setLoading(true);
    let params = new URLSearchParams();
    params.append('limit', limit);
    params.append('pageNumber', page);
    search && params.append('searchKey', search);
    filterData?.device_type && params.append('device_type', filterData?.device_type);
    filterData?.status && params.append('department', filterData?.status);
    let res = await getAssignDeviceListing(params);
    if (res?.statusCode === 200) {
      setLoading(false);
      setTotal(res?.count);
      setDeviceListing(res?.data);
    } else {
      setLoading(false);
      setDeviceListing([]);
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
    }
  };

  const handleReturnDevice = async () => {
    let res = await returnDevice(returnDeviceData?.device?.id, returnDeviceData?.employee?.id);
    if (res?.statusCode === 200) {
      toast.success(res?.message);
      setDeleteModal(false);
      handlegetAssignDeviceListing();
      handleGetCounts();
    } else {
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    let res = await deleteDevice(deleteId);
    if (res.statusCode === 200) {
      setDeleteLoading(false);
      toast.success(res?.message);
      handleGetDeviceListing();
      handleGetCounts();
      setDeleteModal(false);
    } else {
      setDeleteLoading(false);
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Somehing went wrong'
      );
    }
  };

  const optimizedFnAssign = useCallback(debounce(handlegetAssignDeviceListing), [
    page,
    limit,
    filterData,
    activeTab
  ]);
  const optimizedFnInventory = useCallback(debounce(handleGetDeviceListing), [
    page,
    limit,
    filterData,
    activeTab
  ]);

  useEffect(() => {
    if (activeTab == hmsTabEnum?.INVENTORY) {
      if (search !== null) {
        optimizedFnInventory(search);
      } else {
        handleGetDeviceListing();
      }
    } else if (activeTab == hmsTabEnum?.ASSIGNEE) {
      if (search !== null) {
        optimizedFnAssign(search);
      } else {
        handlegetAssignDeviceListing();
      }
    }
  }, [page, limit, search, filterData, activeTab]);

  useEffect(() => {
    if (activeTab === hmsTabEnum?.ASSIGNEE) {
      deviceListing?.map((item) => fetchDesignation(item));
    }
  }, [deviceListing]);

  useEffect(() => {
    handleGetCounts();
  }, []);

  return (
    <div>
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={activeTab == hmsTabEnum?.INVENTORY ? 'Delete Hardware' : 'Return Device'}
          onSubmit={activeTab == hmsTabEnum?.INVENTORY ? handleDelete : handleReturnDevice}
          buttonName={activeTab == hmsTabEnum?.INVENTORY ? 'Delete' : 'Return'}
          description={
            activeTab == hmsTabEnum?.INVENTORY
              ? 'Are you sure you want to delete this Hardware?'
              : 'Are you sure you want to Return this Device?'
          }
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
          deleteId={deleteId}
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
          <ActivityEmployee />
        </Drawer>
      )}
      {addModal && (
        <AddModal
          open={addModal}
          onClose={() => setAddModal(false)}
          handleCount={handleGetCounts}
          handleGetDeviceListing={
            activeTab == hmsTabEnum?.INVENTORY
              ? handleGetDeviceListing
              : handlegetAssignDeviceListing
          }
        />
      )}
      {filterDrawer && (
        <HmsFilter
          open={filterDrawer}
          onClose={() => setFilterDrawer(false)}
          filterData={filterData}
          setFilterData={setFilterData}
        />
      )}
      <GridBox cols="5">
        {(statsData || [])?.map((item, index) => (
          <div key={item?.bg + index}>
            <ProjectCard
              image={item.icon}
              bg={item.bg}
              loading={cardLoading}
              content={
                <div>
                  <CardContent>{item.label}</CardContent>
                  <Title style={{ margin: 0 }} level={2}>
                    <CountUp end={item.value.toString().padStart(2, '0')} />
                  </Title>
                </div>
              }
            />
          </div>
        ))}
      </GridBox>

      <StickyBox padding="8px 0">
        <FlexWrapper
          width={'100%'}
          justify={largeScreen ? 'space-between' : 'center'}
          gap="16px"
          cursor="default"
          margin="12px 0"
          style={{ marginBottom: '16px' }}>
          <FlexWrapper justify="start">
            <Segmented
              value={activeTab}
              prefixCls="antCustomSegmented"
              options={HMSTabOptions}
              onChange={(value) => {
                setAddModal(false);
                setDeviceListing([]);
                setLoading(true);
                dispatch(updateHmsTab(value));
                setFilterData({});
              }}
            />
          </FlexWrapper>

          <FlexWrapper justify={'end'} gap="6px" cursor="default">
            <SearchField
              placeholder="Search by Device Type..."
              style={{ width: '250px' }}
              value={search}
              onChange={(value) => setSearch(value)}
            />
            <Badge
              count={Object?.values(filterData || {})?.reduce(
                (acc, item) =>
                  acc + (item ? (Array.isArray(item) ? (item?.length > 0 ? 1 : 0) : 1) : 0),
                0
              )}
              color="#7c71ff"
              offset={[-9, 4]}
              prefixCls="filterBadge">
              <Button prefixCls="custom-filter-btn" onClick={() => setFilterDrawer(true)}>
                <FilterIconNew /> Filter
              </Button>
            </Badge>
            {canCreate && (
              <Button type="text" onClick={() => setAddModal(true)} prefixCls="antCustomBtn">
                {activeTab === hmsTabEnum?.INVENTORY
                  ? '+ Add Hardware'
                  : activeTab === hmsTabEnum?.ASSIGNEE && 'Assign Hardware'}
              </Button>
            )}
          </FlexWrapper>
        </FlexWrapper>
      </StickyBox>

      {loading || deviceListing?.length > 0 ? (
        <>
          <Table
            prefixCls="antCustomTable"
            columns={columns}
            dataSource={deviceListing}
            pagination={false}
            loading={loading}
          />
          {total > limit && (
            <PaginationBox>
              <Pagination
                current={page}
                prefixCls="custom-pagination"
                pageSize={limit}
                total={total}
                onChange={handlOnChange}
                showSizeChanger={false}
              />
            </PaginationBox>
          )}
        </>
      ) : (
        <>
          <EmptyData
            height={'50vh'}
            icon={
              activeTab === hmsTabEnum?.INVENTORY ? (
                <NoData />
              ) : (
                activeTab === hmsTabEnum?.ASSIGNEE && <NoMilestone />
              )
            }
            title={
              activeTab === hmsTabEnum?.INVENTORY
                ? 'No Hardware'
                : activeTab === hmsTabEnum?.ASSIGNEE && 'No Assignee'
            }
            subTitle={
              <FlexWrapper direction="column">
                <p style={{ margin: 0 }}>
                  {activeTab === hmsTabEnum?.INVENTORY
                    ? 'No hardware add yet kindly add first hardware'
                    : activeTab === hmsTabEnum?.ASSIGNEE &&
                      'No device assignee yet kindly assign first device'}
                </p>
                {canCreate && (
                  <Button
                    onClick={() => setAddModal(true)}
                    prefixCls="antCustomBtn"
                    style={{ margin: '16px 0' }}>
                    {activeTab === hmsTabEnum?.INVENTORY
                      ? '+ Add Hardware'
                      : activeTab === hmsTabEnum?.ASSIGNEE && 'Assign Hardware'}
                  </Button>
                )}
              </FlexWrapper>
            }
          />
        </>
      )}
    </div>
  );
};

export default HMS;
