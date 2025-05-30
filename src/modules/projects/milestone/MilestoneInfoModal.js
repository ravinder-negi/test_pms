import { Modal } from 'antd';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import React from 'react';
import { DarkText, FlexWrapper, GreyText } from '../../../theme/common_style';
import styled from '@emotion/styled/macro';
import TextArea from 'antd/es/input/TextArea';
import DocumentCard from '../../../components/projects/DocumentCard';
import moment from 'moment';
import {
  activeStatusTag,
  generateEmployeeImgUrl,
  getFullName
} from '../../../utils/common_functions';
import { AvatarGroupRow } from '../../../components/common/AvatarGroup';
import { milestoneStatusOption } from '../../../utils/constant';

const MilestoneInfoModal = ({ open, onCancel, data }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      prefixCls="antCustomModal"
      width={500}
      footer={null}>
      <FlexWrapper justify="space-between">
        <Title level={4} style={{ margin: 0 }}>
          Milestone Info
        </Title>
        {activeStatusTag(milestoneStatusOption, 'id', data?.status)}
      </FlexWrapper>
      <FlexWrapper justify="space-between" margin="20px 0">
        <FlexWrapper direction="column" align="start" gap="3px" width="33%">
          <GreyText>Title</GreyText>
          <DarkText>{data?.name}</DarkText>
        </FlexWrapper>
        <FlexWrapper direction="column" align="start" gap="3px" width="33%">
          <GreyText>Start Date</GreyText>
          <DarkText>
            {data?.start_date ? moment(data?.start_date).format('DD MMM YYYY') : 'N/A'}
          </DarkText>
        </FlexWrapper>
        <FlexWrapper direction="column" align="start" gap="3px" width="33%">
          <GreyText>Due Date</GreyText>
          <DarkText>
            {data?.due_date ? moment(data?.due_date).format('DD MMM YYYY') : 'N/A'}
          </DarkText>
        </FlexWrapper>
      </FlexWrapper>
      {data?.project_milestone_assignee?.length > 0 && (
        <FlexWrapper direction="column" align="start" gap="6px">
          <GreyText>Assignee</GreyText>
          <GreyContainer style={{ flexWrap: 'wrap' }}>
            {data?.project_milestone_assignee?.map((incharge) => {
              let info = incharge?.assignee_details || {};
              let name = getFullName(info?.first_name, info?.middle_name, info?.last_name);
              return (
                <AvatarGroupRow
                  key={info?.id}
                  name={name}
                  baseUrl={generateEmployeeImgUrl(info?.id)}
                  role={incharge?.role}
                />
              );
            })}
          </GreyContainer>
        </FlexWrapper>
      )}
      <FlexWrapper direction="column" align="start" gap="6px" margin="20px 0">
        <GreyText>Milestone Details</GreyText>
        <TextArea readOnly style={{ resize: 'none' }} rows={5} value={data?.milestone_detail} />
      </FlexWrapper>
      {data?.projectMilestone?.[0]?.link_url &&
        data?.projectMilestone?.map((el, idx) => (
          <FlexWrapper
            key={idx}
            direction="column"
            align="start"
            gap="3px"
            margin="20px 0"
            cursor="auto">
            <p style={{ margin: 0 }}>Link URL</p>
            <a
              href={el?.link_url}
              target="_blank"
              rel="noreferrer"
              style={{ margin: 0, color: '#7C71FF', width: '100%', textDecoration: 'none' }}>
              {el?.link_url}
            </a>
          </FlexWrapper>
        ))}
      {data?.milestone_documents?.length > 0 &&
        data?.milestone_documents?.map((el, idx) => (
          <DocumentCard
            key={idx}
            style={{ marginTop: '10px' }}
            data={{
              name: el?.document?.split('/')?.[3] || el?.document?.split('/')?.[2],
              size: '200 KB',
              url: process.env.REACT_APP_S3_BASE_URL + el?.document
            }}
            canDelete={false}
          />
        ))}
    </Modal>
  );
};

export default MilestoneInfoModal;

MilestoneInfoModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  data: PropTypes.object
};

const GreyContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  background-color: #f1f1f1;
  border-radius: 12px;
  padding: 16px;
`;
