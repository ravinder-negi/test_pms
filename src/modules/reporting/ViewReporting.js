import { Breadcrumb, Card, DatePicker, Divider, Select, Skeleton } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import dayjs from 'dayjs';
import ReportingCard from './ReportingCard';
import EmptyData from '../../components/common/EmptyData';
import { getAllReports } from '../../services/api_collection';
import { getFullName } from '../../utils/common_functions';
import { FlexWrapper } from '../../theme/common_style';
import { DropdownIconNew, LmsIcon, ReportNotFoundIcon } from '../../theme/SvgIcons';

const ViewReporting = () => {
  const location = useLocation();
  const { empId, date, report } = location.state || {};
  const { isEmployee } = useSelector((e) => e.userInfo);
  const [dateRange, setDateRange] = useState([date || null, date || null]);
  const [selectValue, setSelectValue] = useState('selectedDate');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [limit] = useState(10);
  const [page] = useState(1);
  const RangePicker = DatePicker.RangePicker;

  const handleGetList = async () => {
    try {
      setLoading(true);
      let params = new URLSearchParams();
      if (limit) params?.append('limit', limit);
      if (page) params?.append('page', page);
      if (empId) params?.append('empId', empId);
      if (isEmployee && report?.project_id) params?.append('projectId', report?.project_id);
      if (dateRange) {
        params?.append('startDate', dayjs(dateRange[0]).format('YYYY-MM-DD'));
        params?.append('endDate', dayjs(dateRange[1]).format('YYYY-MM-DD'));
      }

      const res = await getAllReports(params);
      if (res?.statusCode === 200) {
        let array = (res?.data?.reportings || [])?.map((el, idx) => ({
          ...el,
          key: idx + 1
        }));
        setData(array || []);
      } else toast.error(res?.message || 'Something went wrong');
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const predefinedRanges = (initialDate) => ({
    selectedDate: [dayjs(initialDate).startOf('day'), dayjs(initialDate).endOf('day')],
    today: [dayjs().startOf('day'), dayjs().endOf('day')],
    yesterday: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
    last7days: [dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')],
    last30days: [dayjs().subtract(29, 'day').startOf('day'), dayjs().endOf('day')]
  });

  const ranges = predefinedRanges(date);

  useEffect(() => {
    handleGetList();
  }, [dateRange]);

  return (
    <div>
      <FlexWrapper justify="space-between" gap="10px">
        <Breadcrumb
          items={[
            { title: <Link to="/reporting">Reporting</Link> },
            {
              title:
                isEmployee && (report?.reporting_date || report?.created_at)
                  ? moment(report?.reporting_date || report?.created_at).format('DD MMM, YYYY')
                  : getFullName(
                      report?.emp_reporting_id?.first_name,
                      report?.emp_reporting_id?.middle_name,
                      report?.emp_reporting_id?.last_name
                    )
            }
          ]}
        />
        <FlexWrapper gap="6px">
          {!isEmployee && selectValue === 'customRange' && (
            <FlexWrapper
              align="center"
              cursor="default"
              wrap="nowrap"
              gap="4px"
              style={{
                backgroundColor: 'white',
                padding: '0 0 0 12px',
                borderRadius: '8px',
                border: '1px solid #E4E4E4'
              }}>
              <LmsIcon />
              <RangePicker
                allowClear={false}
                format={'YYYY-MM-DD'}
                suffixIcon={null}
                onChange={(val) => {
                  if (val && val[0] && val[1]) {
                    const [start, end] = val[0].isBefore(val[1])
                      ? [val[0], val[1]]
                      : [val[1], val[0]];
                    setDateRange([start, end]);
                  } else {
                    setDateRange([null, null]);
                  }
                }}
                value={[
                  dateRange?.[0]
                    ? dayjs(dateRange?.[0]).isValid()
                      ? dayjs(dateRange?.[0])
                      : null
                    : null,
                  dateRange?.[1]
                    ? dayjs(dateRange?.[1]).isValid()
                      ? dayjs(dateRange?.[1])
                      : null
                    : null
                ]}
                disabledDate={(current) => current && current > dayjs().endOf('day')}
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  outline: 'none',
                  height: '40px',
                  borderRadius: '8px',
                  textAlign: 'center !important'
                }}
              />
            </FlexWrapper>
          )}
          {!isEmployee && (
            <Select
              mode="single"
              suffixIcon={<DropdownIconNew />}
              style={{ width: '150px', height: '40px' }}
              value={selectValue}
              onChange={(val) => {
                setSelectValue(val);
                if (val === 'customRange') {
                  return;
                } else {
                  setDateRange(ranges[val]);
                }
              }}
              options={[
                { label: 'Today', value: 'selectedDate' },
                { label: 'Yesterday', value: 'yesterday' },
                { label: 'Last 7 Days', value: 'last7days' },
                { label: 'Last 30 Days', value: 'last30days' },
                { label: 'Custom Range', value: 'customRange' }
              ]}
            />
          )}
        </FlexWrapper>
      </FlexWrapper>
      {!loading ? (
        data?.length > 0 ? (
          data?.map((report, idx) => (
            <ReportingCard report={report} key={idx} handleGetList={handleGetList} />
          ))
        ) : (
          <EmptyData
            height={'70vh'}
            icon={<ReportNotFoundIcon />}
            title={'No Report'}
            subTitle={'No Report Found'}
          />
        )
      ) : (
        <Card style={{ margin: '20px 0' }}>
          <FlexWrapper justify="space-between" gap="50px" width="100%" wrap="nowrap">
            <FlexWrapper direction="column" gap="10px" justify="left" align="start" width="100%">
              <Skeleton.Input active style={{ width: '300px', height: '30px' }} />
              <Skeleton.Input active style={{ width: '150px', height: '20px' }} />
              <Divider style={{ borderColor: '#F1F1F1', borderWidth: '1.5px', margin: '0px' }} />
              <Skeleton active size="large" paragraph={{ rows: 4 }} style={{ width: '80%' }} />
            </FlexWrapper>
            <Skeleton.Node active prefixCls="custom-reporting-skeleton" />
          </FlexWrapper>
        </Card>
      )}
    </div>
  );
};

export default ViewReporting;
