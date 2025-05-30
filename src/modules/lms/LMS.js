import React, { useEffect, useState } from 'react';
import {
  EmployeeLmsIcon,
  EmployeeLmsIcon1,
  EmployeeLmsIcon2,
  LmsCalendarIcon
} from '../../theme/SvgIcons';
import { CardContent, FlexWrapper } from '../../theme/common_style';
import LmsDetails from './LmsDetails';
import { Drawer } from 'antd';
import ActivityDrawer from './ActivityDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { GetLeavesOverviewApi, GetLeaveStatusApi } from '../../redux/lms/apiRoute';
import LmsFilter from './LmsFilter';
import LmsCollapse from './LmsCollapse';
import LeavesOverviewChart from './LeaveOverviewChart';
import ProjectCard from '../../components/projects/ProjectCard';
import Title from 'antd/es/typography/Title';
import { updateActivityDrawer } from '../../redux/sidebar/SidebarSlice';
import CountUp from 'react-countup';
import { useWindowWide } from '../../utils/common_functions';

const LMS = () => {
  const [value, setValue] = useState('yearly');
  const [graphData, setGraphData] = useState();
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState({});
  const [employeeCardData, setEmployeeCardData] = useState();
  const [cardLoading, setCardLoading] = useState(false);
  const largeScreen = useWindowWide(1085);
  const { isEmployee, data } = useSelector((e) => e.userInfo);
  const activityDrawer = useSelector((state) => state?.sidebar?.isActivityDrawer);
  const dispatch = useDispatch();

  const projectCardsData = [
    {
      image: <LmsCalendarIcon />,
      bg: '#DDF3FF',
      title: 'Current Year Leaves',
      value: employeeCardData?.summary?.thisYearLeave
    },
    {
      image: <EmployeeLmsIcon />,
      bg: '#FFF3DB',
      title: 'Current Year Half Day',
      value: employeeCardData?.summary?.thisYearHalfDayLeave
    },
    {
      image: <EmployeeLmsIcon1 />,
      bg: '#E1E7FF',
      title: 'Current Year Short Leaves',
      value: employeeCardData?.summary?.thisYearShortLeave
    },
    {
      image: <EmployeeLmsIcon2 />,
      bg: '#FFCCC8',
      title: `Current Month Leaves`,
      value: employeeCardData?.summary?.thisMonthLeave
    }
  ];

  const getStartAndEndDate = (value) => {
    const endDate = new Date();
    const startDate = new Date();

    switch (value) {
      case 'weekly':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'yearly':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    return {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10)
    };
  };

  const getOverview = async () => {
    const { startDate, endDate } = getStartAndEndDate(value);
    try {
      const payload = {
        type: value,
        start_date: startDate + '',
        end_date: endDate + '',
        id: data?.user_details?.id
      };
      !isEmployee && delete payload?.id;
      const res = await GetLeavesOverviewApi(payload);
      if (res.statusCode === 200) {
        setGraphData(res?.data);
      }
    } catch (errorInfo) {
      if (errorInfo.errorFields.length > 0) {
        form.scrollToField(errorInfo.errorFields[0].name);
      }
    }
  };

  const getEmployeeOverview = async () => {
    setCardLoading(true);
    try {
      const res = await GetLeaveStatusApi({
        filter: value,
        id: data?.user_details?.id
      });
      if (res.statusCode === 200) {
        setEmployeeCardData(res?.data);
      }
    } catch (errorInfo) {
      if (errorInfo.errorFields.length > 0) {
        form.scrollToField(errorInfo.errorFields[0].name);
      }
    } finally {
      setCardLoading(false);
    }
  };

  const updateGraph = () => {
    if (isEmployee) {
      getEmployeeOverview();
    } else {
      getOverview();
    }
  };

  useEffect(() => {
    updateGraph();
  }, [value]);

  return (
    <div style={{ backgroundColor: '#f3f6fc' }}>
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
          <ActivityDrawer id={data?.user_details?.id} />
        </Drawer>
      )}
      {filterDrawer && (
        <LmsFilter
          open={filterDrawer}
          onClose={() => setFilterDrawer(false)}
          appliedFilter={appliedFilter}
          setAppliedFilter={setAppliedFilter}
        />
      )}
      {isEmployee ? (
        <FlexWrapper
          width={'100%'}
          justify={'space-between'}
          direction={largeScreen ? 'row' : 'column'}
          gap="10px"
          wrap="no-wrap"
          cursor="default">
          <LeavesOverviewChart
            setValue={setValue}
            graphData={employeeCardData?.graphData}
            value={value}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2,1fr)',
              gap: '12px',
              width: largeScreen ? '552px' : '100%',
              height: '400px'
            }}>
            {projectCardsData.map((card, index) => (
              <ProjectCard
                key={card?.bg + index}
                image={card.image}
                loading={cardLoading}
                bg={card?.bg}
                content={
                  <div>
                    <CardContent>{card.title}</CardContent>
                    <Title style={{ margin: 0 }} level={2}>
                      <CountUp end={card.value?.toString().padStart(2, '0')} />
                    </Title>
                  </div>
                }
              />
            ))}
          </div>
        </FlexWrapper>
      ) : (
        <LmsCollapse
          setValue={setValue}
          graphData={employeeCardData ?? graphData}
          value={value}
          cardLoading={cardLoading}
        />
      )}
      <LmsDetails
        updateGraph={updateGraph}
        setFilterDrawer={setFilterDrawer}
        appliedFilter={appliedFilter}
      />
    </div>
  );
};

export default LMS;
