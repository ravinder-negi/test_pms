import React, { useEffect, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { Badge, Calendar, Select, Table } from 'antd';
import { BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from 'recharts';
import styled from '@emotion/styled/macro';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { ContainerStyled } from './DashboardStyle';
import { DropdownIconNew, NoData, NoLeaveIcon, ViewIconNew } from '../../theme/SvgIcons';
import Tag from '../../components/common/Tag';
import EmptyData from '../../components/common/EmptyData';
import TableLoader from '../../components/loaders/TableLoader';
import { GetLeavesListingApi } from '../../redux/lms/apiRoute';
import { generateEmployeeImgUrl, getCategory, getFullName, getSlot } from '../../utils/common_functions';
import { projectsData, projectTypeData, casualLeaveInfo, attendanceInfo } from './DashboardConstants';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isEmployee } = useSelector((state) => state.userInfo);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableApiData, setTableApiData] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState('Active');
  const [activeBillingTab, setActiveBillingTab] = useState('Overall');
  const [attendanceMonth, setAttendanceMonth] = useState(dayjs().format('MMMM YYYY'));

  const fetchLeaveData = async () => {
    setTableLoading(true);
    try {
      const params = new URLSearchParams({ page: 1, limit: 5, filter: 'Upcoming Leaves' });
      const response = await GetLeavesListingApi(params);
      if (response?.statusCode === 200) {
        setTableApiData(response?.data?.leaves || []);
      } else {
        toast.error(response?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to fetch leave data');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const renderTableColumns = () => {
    if (isEmployee) return [];
    return [
      {
        title: 'Emp Name',
        dataIndex: 'employee',
        key: 'emp_name',
        render: (employee) => (
          <FlexWrapper justify="start" gap="6px">
            <AvatarGroup avatars={[{ name: getFullName(employee), src: generateEmployeeImgUrl(employee?.id) }]} />
            <span>{employee?.first_name}</span>
          </FlexWrapper>
        ),
      },
      {
        title: 'Emp ID',
        key: 'employee_id',
        render: (_, record) => {
          let employee = record?.employee;
          return (
            <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
              <span style={{ whiteSpace: 'nowrap' }}>{employee?.emp_code}</span>
            </FlexWrapper>
          );
        },
      },
      {
        title: 'Role',
        key: 'role',
        render: (_, record) => {
          let employee = record?.employee;
          return (
            <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
              <span style={{ whiteSpace: 'nowrap' }}>{employee?.role_id?.role}</span>
            </FlexWrapper>
          );
        },
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
        },
      },
      {
        title: 'Start Date',
        dataIndex: 'start_date',
        key: 'start_date',
        render: (startDate) => {
          return (
            <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
              <span style={{ whiteSpace: 'nowrap' }}>{startDate}</span>
            </FlexWrapper>
          );
        },
      },
      {
        title: 'End Date',
        dataIndex: 'end_date',
        key: 'end_date',
        render: (endDate) => {
          return (
            <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
              <span style={{ whiteSpace: 'nowrap' }}>{endDate}</span>
            </FlexWrapper>
          );
        },
      },
      {
        title: 'Leave Category',
        dataIndex: 'leave_category',
        key: 'leave_category',
        render: (leave_category) => getCategory(leave_category) ?? 'N/A',
      },
      {
        title: 'Leave Slot',
        dataIndex: 'leave_slot',
        key: 'leave_slot',
        render: (leave_slot) => getSlot(leave_slot) ?? 'N/A',
      },
      {
        title: 'Status',
        dataIndex: 'leave_status',
        key: 'leave_status',
        render: (status) => getLeaveStatusTag(status),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        className: 'action-column',
        render: (_, data) => {
          return (
            <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor={'default'}>
              <FlexWrapper
                onClick={() => {
                  navigate(`/lms/details/${data?.id}`, {
                    state: { lms: data },
                  });
                }}
                style={{
                  backgroundColor: '#7C71FF',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                }}
              >
                <ViewIconNew />
              </FlexWrapper>
            </FlexWrapper>
          );
        },
      },
    ];
  };

  const getContainerWidth = (width, isEmployee) => {
    if (width < 1024) return '100%';
    return isEmployee ? '80%' : '100%';
  };

  return (
    <>
      <Title level={4} style={{ margin: 0, textAlign: 'left' }}>
        Analytics Overview
      </Title>
      <FlexBox margin="10px 0" gap="10px" align="unset">
        <ContainerStyled
          style={{ paddingLeft: 0 }}
          width={getContainerWidth(width, isEmployee)}
        >
          <FlexWrapper justify="space-between" width="100%" style={{ padding: '0 10px 0 30px' }}>
            <FlexWrapper direction="column" align="start">
              <p style={{ color: '#767676', margin: 0 }}>Statistics</p>
              <Title level={4} style={{ margin: 0 }}>
                Project Overview
              </Title>
            </FlexWrapper>
            <Select
              prefixCls="antCustomDropdown"
              suffixIcon={<DropdownIconNew />}
              defaultValue="weekly"
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
          </FlexWrapper>
          <div style={{ paddingLeft: '20px', width: '100%', margin: '10px 0 20px' }}>
            <div style={{ borderTop: '1px solid #E5E5EF' }} />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={projectsData || []}>
              <CartesianGrid strokeDasharray="1" vertical={false} horizontal={true} />
              <XAxis dataKey={'name'} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 40]} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey={'count'} fill="#8884d8" barSize={38}>
                {projectsData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ContainerStyled>
        <ContainerStyled style={{ paddingLeft: 0 }}>
          <FlexWrapper justify="space-between" width="100%" style={{ padding: '0 10px 0 30px' }}>
            <FlexWrapper direction="column" align="start">
              {isEmployee ? (
                <>
                  <p style={{ color: '#767676', margin: 0 }}>Statistics</p>
                  <Title level={4} style={{ margin: 0 }}>
                    Your Attendance
                  </Title>
                </>
              ) : (
                <>
                  <p style={{ color: '#767676', margin: 0 }}>Projects</p>
                  <Select
                    prefixCls="transparentDropdown"
                    suffixIcon={<DropdownIconNew />}
                    defaultValue={'Active'}
                    onChange={(val) => setSelectedProjectType(val)}
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Delivered', label: 'Delivered' },
                      { value: 'Hired', label: 'Hired' },
                      { value: 'Disputed', label: 'Disputed' },
                      { value: 'Cancelled', label: 'Cancelled' },
                      { value: 'Suspended', label: 'Suspended' },
                    ]}
                  />
                </>
              )}
            </FlexWrapper>
            {isEmployee ? (
              <Select
                prefixCls="antCustomDropdown"
                suffixIcon={<DropdownIconNew />}
                defaultValue={attendanceMonth}
                onChange={(val) => setAttendanceMonth(val)}
                options={[
                  { value: dayjs().format('MMMM YYYY'), label: 'Current Month' },
                  {
                    value: dayjs().subtract(1, 'month').format('MMMM YYYY'),
                    label: 'Previous Month',
                  },
                ]}
              />
            ) : (
              <>
                <FlexWrapper gap="4px">
                  <span style={{ fontSize: '30px', color: '#4A3AFF' }}>•</span>
                  <GreyText>{selectedProjectType}</GreyText>
                </FlexWrapper>
              </>
            )}
          </FlexWrapper>
          <div style={{ paddingLeft: '20px', width: '100%', margin: '10px 0 20px' }}>
            <div style={{ borderTop: '1px solid #E5E5EF' }} />
          </div>
          {isEmployee ? (
            <FlexWrapper
              justify="start"
              style={{ paddingLeft: '20px' }}
              wrap="nowrap"
              gap="20px"
              align="start"
            >
              <div style={{ width: '45%' }}>
                <Title level={5} style={{ margin: 0, textAlign: 'left' }}>
                  Attendance Info
                </Title>
                <StyledList style={{ listStyle: 'none' }}>
                  {attendanceInfo &&
                    attendanceInfo?.map((item, i) => (
                      <li
                        key={i}
                        style={i === attendanceInfo?.length - 1 ? { border: 'none' } : {}}
                      >
                        <Dot color={item?.color} />
                        <FlexWrapper justify="space-between" width="100%">
                          <DarkText>{item?.key}</DarkText>
                          <GreyText>{item?.value || 0}</GreyText>
                        </FlexWrapper>
                      </li>
                    ))}
                </StyledList>
              </div>
              <div style={{ width: '55%' }}>
                <Calendar
                  fullscreen={false}
                  prefixCls="attendanceCalendar"
                  value={dayjs(attendanceMonth)}
                  disabledDate={() => true}
                  headerRender={({ value }) => (
                    <Title style={{ margin: '0 0 6px' }} level={5}>
                      {dayjs(value).format('MMMM YYYY')}
                    </Title>
                  )}
                  fullCellRender={(value) => {
                    const date = value.format('YYYY-MM-DD');
                    const color = attendanceInfo?.find((item) => item.dates.includes(date))?.color;

                    return (
                      <div style={{ position: 'relative', height: '100%' }}>
                        <div style={{ position: 'relative' }}>
                          {value?.format('DD')}
                          {color && (
                            <div style={{ position: 'absolute', top: -10, right: 15 }}>
                              <Badge color={color} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </FlexWrapper>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={projectTypeData}>
                <CartesianGrid strokeDasharray="1" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="linear"
                  strokeWidth={1.5}
                  dataKey="count"
                  stroke="#4A3AFF"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ContainerStyled>
      </FlexBox>
      <ContainerStyled style={{ paddingLeft: 0 }}>
        <FlexWrapper justify="space-between" width="100%" style={{ padding: '0 10px 0 30px' }}>
          <FlexWrapper direction="column" align="start">
            {isEmployee ? (
              <>
                <p style={{ margin: '0', fontWeight: 600, fontSize: '20px' }}>Casual Leave</p>
                <PurpleText>
                  <span style={{ fontWeight: 800 }}>Apply Date:</span> 10 Mar, 2025
                </PurpleText>
              </>
            ) : (
              <>
                <p style={{ margin: '0', fontWeight: 500 }}>Total Billing</p>
                <Segmented
                  style={{ marginTop: '6px' }}
                  prefixCls="antCustomSegmented"
                  value={activeBillingTab}
                  options={['Overall', 'Project Wise']}
                  onChange={(value) => setActiveBillingTab(value)}
                />
              </>
            )}
          </FlexWrapper>
          {isEmployee ? (
            <Tag.warning>Pending</Tag.warning>
          ) : (
            <Select
              prefixCls="antCustomDropdown"
              suffixIcon={<DropdownIconNew />}
              defaultValue="weekly"
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
          )}
        </FlexWrapper>
        {isEmployee ? (
          <>
            <div style={{ padding: '20px 10px 0 30px' }}>
              <GridBox cols="6">
                {casualLeaveInfo?.map((item, i) => (
                  <InfoWrapper key={i}>
                    <span>{item?.label}</span>
                    <p>{item?.info}</p>
                  </InfoWrapper>
                ))}
                <FlexWrapper gap="6px">
                  <ViewIconBox>
                    <ViewIconNew />
                  </ViewIconBox>
                  <EditIconBox canUpdate={true}>
                    <EditIcon />
                  </EditIconBox>
                  <DeleteIconBox canDelete={true}>
                    <DeleteIcon />
                  </DeleteIconBox>
                </FlexWrapper>
              </GridBox>
            </div>
          </>
        ) : (
          <>
            <div style={{ paddingLeft: '20px', width: '100%', margin: '14px 0 20px' }}>
              <div style={{ borderTop: '1px solid #E5E5EF' }} />
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={projectsData || []}>
                <CartesianGrid strokeDasharray="1" vertical={false} horizontal={true} />
                <XAxis dataKey={'name'} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 40]} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey={'count'} fill="#8884d8" barSize={38}>
                  {projectsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </ContainerStyled>
      <FlexWrapper justify="space-between" margin="30px 0 10px">
        <Title level={4} style={{ margin: 0, textAlign: 'left' }}>
          {isEmployee ? 'Your Projects' : 'Upcoming Leave'}
        </Title>
        {tableApiData?.length > 0 && (
          <PurpleText onClick={() => navigate('/lms')}>See More</PurpleText>
        )}
      </FlexWrapper>
      {tableApiData && tableApiData?.length > 0 ? (
        <Table
          prefixCls="antCustomTable"
          columns={renderTableColumns()}
          dataSource={tableApiData}
          pagination={false}
          loading={{ spinning: tableLoading, indicator: TableLoader }}
        />
      ) : (
        <ContainerStyled>
          <EmptyData
            height={'300px'}
            icon={isEmployee ? <NoData /> : <NoLeaveIcon />}
            title={isEmployee ? 'No Projects' : 'No Leave'}
            subTitle={
              isEmployee ? 'No project created yet' : 'There are no upcoming leave requests.'
            }
          />
        </ContainerStyled>
      )}
    </>
  );
};

export default Dashboard;

// Styled Components
const FlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.gap || '10px'};
`;

// Constants file: DashboardConstants.js
export const projectsData = [
  { name: 'Active', count: 40 },
  { name: 'Delivered', count: 19 },
  { name: 'Hired', count: 28 },
  { name: 'Disputed', count: 10 },
  { name: 'Cancelled', count: 17 },
  { name: 'Suspended', count: 9 },
];

export const projectTypeData = [
  { date: 'Oct, 24', count: 2 },
  { date: 'Nov, 24', count: 3 },
  { date: 'Dec, 24', count: 2 },
  { date: 'Jan, 24', count: 5 },
  { date: 'Feb, 24', count: 1 },
  { date: 'Mar, 24', count: 3 },
];

export const casualLeaveInfo = [
  { label: 'Start Date', info: '24 Mar, 2025' },
  { label: 'End Date', info: '24 Mar, 2025' },
  { label: 'Last Leave Date', info: '10 Mar, 2025' },
  { label: 'No. of Leaves', info: '1' },
  { label: 'Quota', info: '2' },
];

export const attendanceInfo = [
  { key: 'Present', value: 20, color: '#5EB85C', dates: ['2025-04-01', '2025-04-02'] },
  { key: 'Short Leave', value: 2, color: '#255BFF', dates: ['2025-04-23'] },
  { key: 'Half Day', value: 1, color: '#E2A100', dates: ['2025-04-11'] },
  { key: 'Leave', value: 1, color: '#FB4A49', dates: ['2025-04-10'] },
];
