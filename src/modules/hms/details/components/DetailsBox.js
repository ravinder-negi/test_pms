import PropTypes from 'prop-types';
import React from 'react';
import {
  ClickWrapper,
  EditIconBox,
  FlexWrapper,
  GridBox,
  InfoWrapper
} from '../../../../theme/common_style';
import Title from 'antd/es/typography/Title';
import { EditIcon } from '../../../../theme/SvgIcons';
import { Divider, Skeleton } from 'antd';
import styled from '@emotion/styled/macro';
import { checkPermission } from '../../../../utils/common_functions';
import { useSelector } from 'react-redux';

const DetailsBox = ({ heading, cols, data, handleEdit, loading }) => {
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'HMS';
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  return (
    <ContentWrapper>
      <FlexWrapper justify="space-between" width="100%">
        <Title level={4} style={{ margin: 0 }}>
          {heading}
        </Title>
        {handleEdit && canUpdate && (
          <ClickWrapper onClick={handleEdit}>
            <EditIconBox canUpdate={canUpdate}>
              <EditIcon />
            </EditIconBox>
          </ClickWrapper>
        )}
      </FlexWrapper>
      <Divider style={{ margin: 0, borderColor: '#E3E3E3' }} />
      <GridBox cols={cols} style={{ width: '100%', marginTop: '6px', alignItems: 'start' }}>
        {data?.map((item) => (
          <InfoWrapper key={item?.key}>
            <span>{item?.key}</span>
            {loading ? (
              <Skeleton.Input active size="small" style={{ width: 80, height: 16, margin: 0 }} />
            ) : (
              <p>{item?.value?.length <= 0 ? 'N/A' : item?.value}</p>
            )}
          </InfoWrapper>
        ))}
      </GridBox>
    </ContentWrapper>
  );
};

DetailsBox.propTypes = {
  heading: PropTypes.string,
  cols: PropTypes.number,
  data: PropTypes.array,
  handleEdit: PropTypes.func,
  loading: PropTypes.bool
};

export default DetailsBox;

const ContentWrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  gap: 10px;
  align-items: start;
  justify-content: start;
  background-color: white;
  border-radius: 12px;
  padding: 24px 16px;
  margin: 6px 0;
`;
