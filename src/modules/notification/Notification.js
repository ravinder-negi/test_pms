import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Title from 'antd/es/typography/Title';
import React, { useState } from 'react';
import { Button, Card, DatePicker, Segmented, Select, Skeleton } from 'antd';
import NotificationCard from './NotificationCard';
import SendNotification from './SendNotification';
import EmptyData from '../../components/common/EmptyData';
import SearchField from '../../components/searchField/SearchField';
import useDepartmentOptions from '../../hooks/useDepartmentOptions';
import useWindowWidth from '../../hooks/useWindowWidth';
import { GetNotificationApi, ReceivedNotificationApi } from '../../redux/notification/apiRoute';
import { DropdownIconNew, LmsIcon, ReportNotFoundIcon } from '../../theme/SvgIcons';
import { FlexWrapper, GridBox } from '../../theme/common_style';
import { checkPermission, currentModule, debounce } from '../../utils/common_functions';
import { StickyBox } from '../../utils/style';
import { actionTypeEnums, notificationActiveTabEnums } from '../../utils/constant';
import { toast } from 'react-toastify';
import { updateNotificationTab } from '../../redux/notification/NotificationSlice';

const Notification = () => {
  const { data, isEmployee, loggedUserType } = useSelector((e) => e.userInfo);
  const [sendNotificationModal, setSendNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState();
  const activeTab = useSelector((state) => state?.NotificationSlice?.NotificationTab);
  // const [activeTab, setActiveTab] = useState(
  //   isEmployee ? notificationActiveTabEnums.NOTIFICATIONS : notificationActiveTabEnums.SENT
  // );
  const dispatch = useDispatch();
  const [selectedDept, setSelectedDept] = useState();
  const [selectedDates, setSelectedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { options } = useDepartmentOptions();
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const width = useWindowWidth();
  let permissionSection = currentModule();
  const canCreate = checkPermission(permissionSection, actionTypeEnums.CREATE, permissions);
  const { RangePicker } = DatePicker;

  const fetchData = async (search) => {
    setLoading(true);

    const id = data?.user_details?.id || loggedUserType?.id;
    const params = new URLSearchParams();

    if (search?.trim()?.length > 0) params.append('search', search);
    if (activeTab !== notificationActiveTabEnums.NOTIFICATIONS)
      params.append('is_draft', activeTab === notificationActiveTabEnums.DRAFTS ? true : false);

    if (selectedDept?.length > 0) {
      params.append('departmentIds', selectedDept);
    }

    if (selectedDates && selectedDates.length > 0) {
      selectedDates?.[0] &&
        params.append('startDate', dayjs(selectedDates[0]).format('YYYY-MM-DD'));
      selectedDates?.[1] && params.append('endDate', dayjs(selectedDates[1]).format('YYYY-MM-DD'));
    }

    try {
      let res;
      if (activeTab === notificationActiveTabEnums.NOTIFICATIONS) {
        res = await ReceivedNotificationApi(id, params);
      } else {
        res = await GetNotificationApi(params);
      }
      if (res.statusCode === 200) {
        setNotificationData(res?.data);
      } else {
        toast.warning(res?.message);
      }
    } catch (errorInfo) {
      console.log(errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleSelectChange = (value) => {
    setSelectedDept(value);
  };

  const optimizedFn = useCallback(debounce(fetchData), [activeTab, selectedDates, selectedDept]);

  useEffect(() => {
    if (search !== null) {
      optimizedFn(search);
    } else {
      fetchData();
    }
  }, [activeTab, selectedDates, search, selectedDept]);

  useEffect(() => {
    if (isEmployee) {
      dispatch(updateNotificationTab(notificationActiveTabEnums.NOTIFICATIONS));
    }
  }, []);

  return (
    <div>
      <StickyBox>
        <FlexWrapper justify={'space-between'} gap="10px">
          {isEmployee ? (
            <Title level={3} style={{ margin: 0 }}>
              Notifications
            </Title>
          ) : canCreate ? (
            <Button prefixCls="antCustomBtn" onClick={() => setSendNotificationModal(true)}>
              Create Notification
            </Button>
          ) : (
            <div></div>
          )}
          <FlexWrapper gap="6px">
            <SearchField
              placeholder="Search by Title..."
              style={{ width: '250px' }}
              onChange={handleSearchChange}
              value={search}
            />
            <FlexWrapper
              align="center"
              cursor="default"
              gap="4px"
              style={{ backgroundColor: 'white', padding: '0 0 0 12px', borderRadius: '8px' }}>
              <LmsIcon />
              <RangePicker
                allowClear={true}
                suffixIcon={null}
                value={selectedDates}
                onChange={(val) => setSelectedDates(val)}
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  outline: 'none',
                  width: '250px',
                  height: '40px',
                  borderRadius: '8px',
                  textAlign: 'center !important'
                }}
              />
            </FlexWrapper>
            {!isEmployee && (
              <Select
                showSearch
                mode="multiple"
                className="antSelectorSmall"
                maxTagCount="responsive"
                style={{ width: '200px' }}
                suffixIcon={<DropdownIconNew />}
                placeholder="Select Department"
                value={selectedDept}
                onChange={handleSelectChange}
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }>
                {options?.map((el) => (
                  <Select.Option key={el?.label} value={el?.value}>
                    {el?.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FlexWrapper>
        </FlexWrapper>
      </StickyBox>
      {!isEmployee && (
        <FlexWrapper justify="space-between" gap="10px" margin="10px 0 0">
          <Title level={4} style={{ margin: 0 }}>
            {activeTab}
          </Title>
          {!isEmployee && (
            <Segmented
              prefixCls="antCustomSegmented"
              value={activeTab}
              options={[notificationActiveTabEnums.SENT, notificationActiveTabEnums.DRAFTS]}
              onChange={(val) => {
                setLoading(true);
                // setActiveTab(val);
                dispatch(updateNotificationTab(val));
              }}
            />
          )}
        </FlexWrapper>
      )}
      <GridBox
        style={{ marginTop: '20px' }}
        cols={
          notificationData?.length > 0 || loading
            ? width > 1160
              ? 4
              : width > 950
              ? 3
              : width > 500
              ? 2
              : 1
            : 1
        }>
        {!loading ? (
          notificationData?.length > 0 ? (
            notificationData?.map((item) => (
              <NotificationCard
                key={item?.id}
                dataItem={item}
                fetchData={() => fetchData(search)}
              />
            ))
          ) : (
            <EmptyData
              height={'60vh'}
              icon={<ReportNotFoundIcon />}
              title={`No ${activeTab}`}
              subTitle={`No ${activeTab} Found`}
            />
          )
        ) : (
          Array(4)
            .fill(0)
            .map((_, index) => (
              <Card key={index} prefixCls="custom-card-notifications">
                <Skeleton.Avatar active size={44} shape="circle" />
                <Skeleton title={false} active paragraph={{ rows: 4 }} />
              </Card>
            ))
        )}
      </GridBox>
      <SendNotification
        open={sendNotificationModal}
        onCancel={() => setSendNotificationModal(false)}
        fetchData={() => fetchData(search)}
      />
    </div>
  );
};
export default Notification;
