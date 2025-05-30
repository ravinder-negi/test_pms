import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, DatePicker, Select, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import CountUp from 'react-countup';
import axios from 'axios';
import dayjs from 'dayjs';
import { CardContent, FlexWrapper } from '../../theme/common_style';
import { useWindowWide } from '../../utils/common_functions';
import ProjectCard from '../../components/projects/ProjectCard';
import SearchField from '../../components/searchField/SearchField';
import TableLoader from '../../components/loaders/TableLoader';
import Tag from '../../components/common/Tag';
import {
  AttendenceCardIcon2,
  AttendenceCardIcon3,
  AttendenceCardIcon4,
  AttendenceCardIcon5,
  DropdownIconNew,
  LmsIcon
} from '../../theme/SvgIcons';

const attendanceStats = [
  {
    icon: <AttendenceCardIcon2 />,
    bg: '#E4FFDD',
    label: 'Present',
    value: 0
  },
  {
    icon: <AttendenceCardIcon3 />,
    bg: '#E1E7FF',
    label: 'Short Leave',
    value: 0
  },
  {
    icon: <AttendenceCardIcon4 />,
    bg: '#FFF3DB',
    label: 'Half Day',
    value: 0
  },
  {
    icon: <AttendenceCardIcon5 />,
    bg: '#FFCCC8',
    label: 'Leave',
    value: 0
  }
];

const ViewAttendance = () => {
  const largeScreen = useWindowWide(900);
  const [date, setDate] = useState(getPreviousWeekday());
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceFilter, setAttendanceFilter] = useState(null);
  const [statsData, setStatsData] = useState(attendanceStats);
  const [searchValue, setSearchValue] = useState('');

  function getPreviousWeekday() {
    let day = dayjs().subtract(1, 'day');
    while (day.day() === 0 || day.day() === 6) {
      day = day.subtract(1, 'day');
    }
    return day;
  }

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleStatsCount = (data) => {
    const stats = {
      Present: 0,
      'Short Leave': 0,
      'Half Day': 0,
      Leave: 0
    };

    data.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(stats, item.status)) {
        stats[item.status]++;
      }
    });

    return attendanceStats.map((stat) => ({
      ...stat,
      value: stats[stat.label] ?? 0
    }));
  };

  const tableData = useMemo(() => {
    if (!leaveData?.length) return [];
    const filteredData = leaveData
      .filter(
        (item) => !searchValue || item?.name?.toLowerCase().includes(searchValue.toLowerCase())
      )
      .filter((item) => !attendanceFilter || item?.status === attendanceFilter)
      .map((item, index) => ({
        ...item,
        sno: index + 1,
        key: index + 1
      }));
    return filteredData;
  }, [leaveData, attendanceFilter, searchValue]);

  const getStatusTag = (status) => {
    const statusStyles = {
      Present: 'success',
      ['Short Leave']: 'info',
      ['Half Day']: 'warning',
      Leave: 'danger'
    };
    const tagVariant = statusStyles[status] || 'default';
    const TagVariant = Tag[tagVariant];

    return <TagVariant style={{ cursor: 'default' }}>{status}</TagVariant>;
  };

  const fetchLeaveData = async () => {
    setLoading(true);
    let dateFormat = dayjs(date).format('YYYY-MM-DD');
    try {
      const res = await axios.get(
        `http://15.206.230.116:3001/attendance/getPreviousDayLeave?date=${dateFormat}`
      );
      const response = res.data;
      if (response.data?.length > 0) {
        let statusObj = {};
        response.extraData?.color_info?.forEach((val) => {
          statusObj[val.color] = val.value;
        });
        let modifyData = response.data?.map((item) => ({ ...item, status: statusObj[item.color] }));
        setLeaveData(modifyData);
        setStatsData(handleStatsCount(modifyData));
      }
    } catch (err) {
      console.error('Error fetching previous day leave:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'S.NO',
      dataIndex: 'sno',
      key: 'sno'
    },
    {
      title: 'Emp Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, user) => (
        <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
          {user.img ? (
            <Avatar
              style={{ height: '32px', width: '32px', minWidth: '32px' }}
              src={user.img}></Avatar>
          ) : (
            <Avatar
              style={{
                backgroundColor: '#7c71ff',
                height: '32px',
                width: '32px',
                minWidth: '32px'
              }}>
              {name?.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <span style={{ whiteSpace: 'nowrap' }}>{name}</span>
        </FlexWrapper>
      )
    },
    {
      title: 'Department',
      dataIndex: 'departpentName',
      key: 'departpentName',
      render: (department) => (
        <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
          <span style={{ whiteSpace: 'nowrap' }}>{department || ''}</span>
        </FlexWrapper>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    }
  ];

  useEffect(() => {
    if (date) {
      fetchLeaveData();
    }
  }, [date]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: largeScreen ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          gap: '10px'
        }}>
        {(statsData || [])?.map((item, index) => (
          <div key={index}>
            <ProjectCard
              image={item.icon}
              bg={item.bg}
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
      </div>

      <FlexWrapper direction="column" gap="16px" width="100%">
        <FlexWrapper
          width={'100%'}
          justify={'space-between'}
          gap="16px"
          cursor="default"
          style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '20px', fontFamily: 'Plus Jakarta Sans', fontWeight: '700' }}>
            Attendance of {`(${date?.format('DD MMM YYYY')})`}
          </div>
          <FlexWrapper justify={'end'} gap="6px" cursor="default">
            <SearchField
              placeholder="Search by Name..."
              style={{ width: '250px' }}
              onChange={handleSearch}
            />
            <Select
              style={{ width: '130px' }}
              prefixCls="antSubFilter"
              placeholder="Filters"
              suffixIcon={<DropdownIconNew />}
              value={attendanceFilter}
              onChange={(value) => {
                setAttendanceFilter(value);
              }}
              allowClear>
              <Select.Option value="Present">Present</Select.Option>
              <Select.Option value="Leave">Leave</Select.Option>
              <Select.Option value="Half Day">Half Day</Select.Option>
              <Select.Option value="Short Leave">Short Leave</Select.Option>
            </Select>
            <FlexWrapper
              align="center"
              cursor="default"
              gap="4px"
              style={{ backgroundColor: 'white', padding: '0 12px', borderRadius: '8px' }}>
              <LmsIcon />
              <DatePicker
                placeholder="Date..."
                format={'DD MMMM YYYY'}
                prefixCls="form-datepicker"
                value={date ? dayjs(date) : null}
                onChange={(newDate) => setDate(newDate)}
                suffixIcon={null}
                allowClear={false}
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  outline: 'none',
                  width: '120px',
                  borderRadius: '0'
                }}
                disabledDate={(current) => {
                  return (
                    !current ||
                    current >= dayjs().startOf('day') ||
                    current.day() === 0 ||
                    current.day() === 6
                  );
                }}
              />
            </FlexWrapper>
          </FlexWrapper>
        </FlexWrapper>
        <>
          <Table
            prefixCls="antCustomTable"
            columns={columns}
            dataSource={tableData}
            pagination={false}
            loading={{ spinning: loading, indicator: TableLoader }}
          />
        </>
      </FlexWrapper>
    </div>
  );
};

export default ViewAttendance;
