import { Select } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useEffect, useState } from 'react';
import { useWindowWide } from '../../utils/common_functions';
import { frequencyOptions, LmsGraphFilterEnum } from '../../utils/constant';

const LeavesOverviewChart = ({ graphData, value, setValue }) => {
  const { isEmployee } = useSelector((e) => e.userInfo);
  const [data, setData] = useState({});
  const [limit, setLimit] = useState(5);
  const largeScreen = useWindowWide(1085);

  const formatGraphData = (data, filter) => {
    const result = [];

    if (filter === LmsGraphFilterEnum?.YEARLY) {
      const shortMonths = Array.from({ length: 12 }, (_, i) => moment().month(i).format('MMM'));
      const monthMap = Object.fromEntries(shortMonths.map((m) => [m, 0]));

      data?.forEach((item) => {
        const date = new Date(item.period ?? item.label);
        const monthName = moment(date).format('MMM');
        monthMap[monthName] = item.total_leaves ?? item.count;
      });

      for (const [month, count] of Object.entries(monthMap)) {
        result.push({ date: month, leaves: count });
      }
    } else if (filter === LmsGraphFilterEnum?.MONTHLY) {
      const daysInMonth = moment().daysInMonth();
      const currentMonth = moment().format('MMMM');
      const dateMap = {};

      for (let i = 1; i <= daysInMonth; i++) {
        dateMap[i] = 0;
      }

      data?.forEach((item) => {
        const date = new Date(item.period ?? item.label);
        const day = moment(date).date();
        dateMap[day] = item.total_leaves ?? item.count;
      });

      for (const [day, count] of Object.entries(dateMap)) {
        result.push({
          date: `${String(day).padStart(2, '0')} ${currentMonth}`,
          leaves: count
        });
      }
    } else if (filter === LmsGraphFilterEnum?.WEEKLY) {
      const weekMap = {};
      const start = moment().subtract(6, 'days');

      for (let i = 0; i < 7; i++) {
        const date = moment(start).add(i, 'days');
        const key = date.format('YYYY-MM-DD');
        const label = date.format('ddd');
        weekMap[key] = { label, leaves: 0 };
      }

      data?.forEach((item) => {
        const date = moment(item.period ?? item.label).format('YYYY-MM-DD');
        if (weekMap[date]) {
          weekMap[date].leaves = item.total_leaves ?? item.count;
        }
      });

      for (const key of Object.keys(weekMap)) {
        const { label, leaves } = weekMap[key];
        result.push({ date: label, leaves });
      }
    }

    setData(result);
  };

  useEffect(() => {
    if (value === LmsGraphFilterEnum?.MONTHLY) {
      setLimit(6);
    } else if (value === LmsGraphFilterEnum?.YEARLY) {
      setLimit(8);
    } else {
      setLimit(5);
    }
    formatGraphData(graphData, value);
  }, [graphData, value]);
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: largeScreen ? '70%' : '100%',
        height: '400px',
        padding: '20px',
        cursor: 'default'
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E5E7EB',
          paddingBottom: '5px',
          marginBottom: '12px',
          cursor: 'default'
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            cursor: 'default'
          }}>
          {isEmployee && (
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0' }}>Statistics</p>
          )}
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 0' }}>
            Leaves Overview
          </h2>
        </div>

        {!isEmployee && (
          <Select
            defaultValue="weekly"
            value={value}
            onChange={(value) => setValue(value)}
            sx={{
              backgroundColor: '#F9FAFB',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '14px',
              fontWeight: '500'
            }}
            dropdownStyle={{ borderRadius: '8px', width: '100px' }}
            options={frequencyOptions}
          />
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid stroke="transparent" />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval={0}
            tickMargin={20}
            ticks={(() => {
              if (!Array.isArray(data)) return [];

              const total = data.length;
              const step = Math.ceil(total / limit); // limit to ~5 ticks
              const baseTicks = data.filter((_, index) => index % step === 0).map((d) => d.date);

              const lastTick = data[total - 1]?.date;
              if (lastTick && !baseTicks.includes(lastTick)) {
                baseTicks.push(lastTick);
              }

              return baseTicks;
            })()}
            tick={({ x, y, payload }) => (
              <text x={x} y={y + 10} fill="#000" fontSize={12} textAnchor="middle">
                {payload.value}
              </text>
            )}
          />

          <YAxis
            dataKey="leaves"
            axisLine={false}
            tickLine={false}
            tickMargin={20}
            tickCount={5}
            min={5}
            tick={({ x, y, payload }) => (
              <text x={x - 10} y={y + 2} fill="#000" fontSize={12} textAnchor="end">
                {payload.value} d
              </text>
            )}
            allowDecimals={false}
          />

          <Tooltip />
          <Line
            dataKey="leaves"
            stroke={graphData?.length ? '#6366F1' : '#D1D5DB'}
            strokeWidth={2}
            strokeDasharray={graphData?.length ? '0' : '5 5'}
            dot={
              graphData?.length ? { fill: '#fff', stroke: '#6366F1', strokeWidth: 2, r: 5 } : false
            }
            activeDot={graphData?.length ? { r: 6 } : false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeavesOverviewChart;

LeavesOverviewChart.propTypes = {
  setValue: PropTypes.func,
  graphData: PropTypes.array,
  value: PropTypes.string
};
