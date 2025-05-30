/* eslint-disable react/prop-types */
import styled from '@emotion/styled/macro';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { FlexWrapper } from '../../theme/common_style';
import { Collapse, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import dayjs from 'dayjs';

const colors = ['#A8A1FF', '#97DBFF', '#FFC881', '#C58AFF', '#71AFFF', '#82ca9d'];

const ProjectsGraph = ({ data, total, setFilter }) => {
  const now = dayjs();
  const items = [
    {
      key: 1,
      label: (
        <FlexWrapper justify="space-between" width="100%">
          <FlexWrapper direction="column" align="start">
            <p style={{ color: '#767676', margin: 0 }}>Total Projects</p>
            <Title level={4} style={{ margin: 0 }}>
              {total}
            </Title>
          </FlexWrapper>
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              prefixCls="form-select-graph"
              onChange={(e) => setFilter(e)}
              placeholder="Filter By Months"
              options={[
                { value: now.subtract(1, 'month').unix(), label: '1 Month' },
                { value: now.subtract(3, 'month').unix(), label: '3 Month' },
                { value: now.subtract(12, 'month').unix(), label: '1 Year' }
              ]}
            />
          </div>
        </FlexWrapper>
      ),
      children: (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data || []}>
              <CartesianGrid strokeDasharray="1" vertical={false} horizontal={true} />
              <XAxis dataKey={'name'} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 40]} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey={'count'} fill="#8884d8" barSize={38}>
                {(data || [])?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )
    }
  ];
  return (
    <ContentWrapper>
      <Collapse items={items} defaultActiveKey={[]} prefixCls="antCustomCollapse" />
    </ContentWrapper>
  );
};

export default ProjectsGraph;

const ContentWrapper = styled(FlexWrapper)`
  width: 100%;
`;
