/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { FlexWrapper, PurpleText } from '../../theme/common_style';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';
import { DeleteMyIcon, DocumentIconNew } from '../../theme/SvgIcons';

const DocumentCard = ({ data, canDelete, style }) => {
  return (
    <Card style={style}>
      <FlexWrapper justify="space-between" width="100%" align="start">
        <FlexWrapper justify="start" align="start" gap="10px">
          <DocumentIconNew />
          <FlexWrapper direction="column" align="start">
            <p style={{ margin: 0 }}>{data?.name}</p>
            <p style={{ fontSize: '13px', color: '#767676', margin: 0 }}>{data?.size}</p>
            <a href={data?.url} target="_blank">
              <PurpleText>Click to view</PurpleText>
            </a>
          </FlexWrapper>
        </FlexWrapper>
        {canDelete && <DeleteMyIcon />}
      </FlexWrapper>
    </Card>
  );
};

export default DocumentCard;

DocumentCard.propTypes = {
  data: PropTypes.object.isRequired,
  canDelete: PropTypes.bool,
  style: PropTypes.object
};

const Card = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #c8c8c8;
  padding: 20px;
`;
