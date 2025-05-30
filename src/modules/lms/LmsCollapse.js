/* eslint-disable react/prop-types */
import styled from '@emotion/styled/macro';
import { FlexWrapper } from '../../theme/common_style';
import { Collapse } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';
import ProjectCard from '../../components/projects/ProjectCard';
import { LmsCalendarIcon, LmsCalendarIcon2 } from '../../theme/SvgIcons';
import { CardContent } from '../../theme/common_style';
import LeavesOverviewChart from './LeaveOverviewChart';
import CountUp from 'react-countup';
const LmsCollapse = ({ graphData, cardLoading, setValue, value }) => {
  const projectCardsGraphData = [
    {
      image: <LmsCalendarIcon />,
      bg: '#DDF3FF',
      title: `Current Month Leaves`,
      value: graphData?.monthlyLeave
    },
    {
      image: <LmsCalendarIcon2 />,
      bg: '#D9D6FF',
      title: 'Upcoming Leaves',
      value: graphData?.upcomingLeave
    }
  ];

  const items = [
    {
      key: 1,
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'default'
          }}>
          <FlexWrapper direction="column" align="start">
            <p style={{ color: '#767676', margin: 0 }}>Statistics</p>
          </FlexWrapper>
        </div>
      ),
      children: (
        <FlexWrapper
          width={'100%'}
          justify={'space-between'}
          gap="10px"
          wrap="no-wrap"
          cursor="default">
          <LeavesOverviewChart setValue={setValue} graphData={graphData?.graphData} value={value} />
          <FlexWrapper
            wrap="no-wrap"
            direction="column"
            width="30%"
            gap="10px"
            style={{ height: '400px' }}
            cursor="default">
            {projectCardsGraphData.map((card, index) => (
              <ProjectCard
                key={index}
                image={card.image}
                loading={cardLoading}
                bg={card.bg}
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
          </FlexWrapper>
        </FlexWrapper>
      )
    }
  ];
  return (
    <ContentWrapper>
      <Collapse items={items} defaultActiveKey={[]} prefixCls="antCustomCollapse" />
    </ContentWrapper>
  );
};

export default LmsCollapse;

const ContentWrapper = styled(FlexWrapper)`
  width: 100%;

  .antCustomCollapse-content-box {
    background-color: #f3f6fc !important;
  }

  .antCustomCollapse-content-box {
    padding: 10px 10px !important;
  }
`;
