import React, { useCallback, useEffect, useState } from 'react';
import { CardContent, DeleteIconBox, EditIconBox, FlexWrapper } from '../../theme/common_style';
import { Button, Drawer, Select, Table } from 'antd';
import {
  ClientCardIcon1,
  ClientCardIcon2,
  ClientCardIcon3,
  ClientEmptyIcon,
  DeleteIcon,
  EditIcon,
  TrashIconNew,
  ViewIconNew
} from '../../theme/SvgIcons';
import Title from 'antd/es/typography/Title';
import { useDispatch, useSelector } from 'react-redux';
import { updateActivityDrawer } from '../../redux/sidebar/SidebarSlice';
import CountUp from 'react-countup';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import SortByDropdown from '../employees/view-employee/components/SortButton';
import EmptyData from '../../components/common/EmptyData';
import ActivityDrawer from './ActivityDrawer';
import SearchField from '../../components/searchField/SearchField';
import AddId from './AddId';
import AvatarImage from '../../components/common/AvatarImage';
import {
  DeleteProjectSource,
  GetBillingIdCount,
  GetProjectSources
} from '../../redux/billingIds/apiRoute';
import { toast } from 'react-toastify';
import ViewBillingId from './ViewBillingId';
import { StickyBox } from '../../utils/style';
import {
  checkPermission,
  debounce,
  decryptToken,
  getStatusTag,
  useWindowWide
} from '../../utils/common_functions';
import { BillingAllStatus, BillingSortOptions } from '../../utils/constant';
import ProjectCard from '../../components/projects/ProjectCard';

const BillingIds = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const activityDrawer = useSelector((state) => state?.sidebar?.isActivityDrawer);
  const [addModal, setAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(false);
  const largeScreen = useWindowWide(1085);
  const [view, setView] = useState(false);
  const { permissions, user_details } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'Billing Ids';
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [status, setStatus] = useState(undefined);
  const [cardLoading, setCardLoading] = useState(true);

  const billingStatData = [
    {
      icon: <ClientCardIcon1 />,
      bg: '#DDF3FF',
      label: 'Total Billing Ids',
      status: 'total',
      value: 0
    },
    {
      icon: <ClientCardIcon2 />,
      bg: '#FFE8A8',
      label: 'Available Ids',
      status: 'available',
      value: 0
    },
    {
      icon: <ClientCardIcon3 />,
      bg: '#D9D6FF',
      label: 'Occupied Ids',
      status: 'occupied',
      value: 0
    }
  ];
  const [billingStats, setBillingStats] = useState(billingStatData);

  const handleGetList = async (search) => {
    try {
      setLoading(true);
      let params = new URLSearchParams();
      search && params.append('search', search);
      if (sortField && sortOrder) {
        params.append('sortBy', sortField);
        params.append('sortOrder', sortOrder?.toUpperCase());
      }
      if (status !== null && status !== undefined)
        params.append('type', status ? 'Available' : 'Occupied');

      let res = await GetProjectSources(params);
      if (res?.statusCode === 200) {
        setData(res?.data?.results);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      let res = await DeleteProjectSource(editData?.id);
      if (res?.statusCode === 200) {
        toast.success('Id Deleted Successfully');
        handleGetList();
        getCardsCount();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setDeleteModal(false);
      setDeleteLoading(false);
      setEditData(null);
    }
  };

  const getCardsCount = async () => {
    setCardLoading(true);
    try {
      const res = await GetBillingIdCount();
      if (res?.statusCode === 200) {
        res?.data &&
          setBillingStats((prevStats) =>
            prevStats.map((item) => ({
              ...item,
              value: res?.data[item.status] ?? 0
            }))
          );
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setCardLoading(false);
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
      title: 'Username',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (name, user) => (
        <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
          <AvatarImage
            style={{
              height: '32px',
              width: '32px',
              minWidth: '32px',
              fontSize: '16px'
            }}
            image={process.env.REACT_APP_S3_BASE_URL + user?.profile_image}
            name={name}
          />
          <span style={{ whiteSpace: 'nowrap' }}>{name || '-'}</span>
        </FlexWrapper>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'No. of Projects',
      dataIndex: 'no_of_project',
      key: 'no_of_project'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, data) => getStatusTag(data?.no_of_project > 0 ? 'Occupied' : 'Available')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      className: 'action-column',
      render: (_, data) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} cursor="default" wrap={'unset'}>
            <FlexWrapper
              onClick={() => {
                const formatData = { ...data, password: decryptToken(data?.password) };
                setViewData(formatData);
                setView(true);
              }}
              style={{
                backgroundColor: '#7C71FF',
                width: '30px',
                height: '30px',
                borderRadius: '50%'
              }}>
              <ViewIconNew />
            </FlexWrapper>
            {canUpdate && (
              <EditIconBox
                canUpdate={canUpdate}
                onClick={() => {
                  if (canUpdate) {
                    const formatData = { ...data, password: decryptToken(data?.password) };
                    setAddModal(true);
                    setEditData(formatData);
                  }
                }}>
                <EditIcon />
              </EditIconBox>
            )}
            {canDelete && (
              <DeleteIconBox
                canDelete={canDelete}
                onClick={() => {
                  if (canDelete) {
                    setDeleteModal(true);
                    setEditData(data);
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

  const optimizedFn = useCallback(debounce(handleGetList), [sortOrder, sortField, status]);

  useEffect(() => {
    if (search !== null) {
      optimizedFn(search);
    } else {
      handleGetList();
    }
  }, [search, sortOrder, sortField, status]);

  useEffect(() => {
    getCardsCount();
  }, []);

  return (
    <FlexWrapper direction="column" gap="20px" cursor="default">
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
          <ActivityDrawer clientId={user_details?.id} />
        </Drawer>
      )}
      <FlexWrapper
        width="100%"
        direction="column"
        cursor="default"
        gap="5px"
        justify="space-between"
        align="space-between">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,auto)', gap: '16px' }}>
          {billingStats?.map((item, index) => (
            <div key={index}>
              <ProjectCard
                image={item.icon}
                bg={item.bg}
                loading={cardLoading}
                content={
                  <div>
                    <CardContent>{item.label}</CardContent>
                    <Title style={{ margin: 0 }} level={2}>
                      <CountUp end={(item.value || 0)?.toString()?.padStart(2, '0')} />
                    </Title>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </FlexWrapper>

      <FlexWrapper width="100%" gap="20px" cursor="default">
        {deleteModal && (
          <ConfirmationModal
            open={deleteModal}
            onCancel={() => setDeleteModal(false)}
            title={'Delete Billing Id'}
            onSubmit={handleDelete}
            buttonName={'Delete'}
            description={'Are you sure you want to delete this Billing Id?'}
            iconBG={'#FB4A49'}
            icon={<TrashIconNew />}
            loading={deleteLoading}
          />
        )}
        {addModal && (
          <AddId
            open={addModal}
            onClose={() => setAddModal(false)}
            editDetails={editData}
            handleGetList={handleGetList}
          />
        )}
        {view && <ViewBillingId open={view} onClose={() => setView(false)} viewData={viewData} />}
        <StickyBox style={{ width: '100%' }}>
          <FlexWrapper
            justify={largeScreen ? 'space-between' : 'center'}
            width="100%"
            cursor="default"
            gap="10px">
            {canCreate ? (
              <Button
                type="text"
                onClick={() => {
                  setAddModal(true);
                  setEditData(null);
                }}
                prefixCls="antCustomBtn">
                + Add New Id
              </Button>
            ) : (
              <div></div>
            )}
            <FlexWrapper gap="10px">
              <Select
                prefixCls="antSubFilter"
                style={{ width: '135px' }}
                placeholder={`Select Status`}
                value={status}
                allowClear
                onChange={setStatus}
                options={BillingAllStatus}
              />
              <SortByDropdown
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                sortOptions={BillingSortOptions}
                allowClear={true}
              />
              <SearchField
                placeholder="Search by username..."
                style={{ width: '250px' }}
                onChange={(value) => setSearch(value)}
                value={search}
                allowClear={true}
              />
            </FlexWrapper>
          </FlexWrapper>
        </StickyBox>

        <FlexWrapper width="100%" cursor="default">
          {loading || data.length > 0 ? (
            <>
              <Table
                prefixCls="antCustomTable"
                columns={columns}
                dataSource={data}
                pagination={false}
                loading={loading}
              />
            </>
          ) : (
            <FlexWrapper direction="column" gap="10px" cursor="default">
              <EmptyData
                title={'No Data'}
                subTitle={'No Billing Ids created yet kindly create first Billing Id'}
                icon={<ClientEmptyIcon />}
                height={'40vh'}
              />
            </FlexWrapper>
          )}
        </FlexWrapper>
      </FlexWrapper>
    </FlexWrapper>
  );
};

export default BillingIds;
