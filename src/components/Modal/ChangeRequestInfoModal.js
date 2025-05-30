import { Modal, Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import React from 'react';
import { DarkText, FlexWrapper, GreyText } from '../../theme/common_style';
import TextArea from 'antd/es/input/TextArea';
import DocumentCard from '../projects/DocumentCard';

const ChangeRequestInfoModal = ({ open, onCancel, data }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      prefixCls="antCustomModal"
      width={600}
      footer={null}>
      <Title level={4} style={{ margin: 0 }}>
        Change Request info
      </Title>
      <FlexWrapper justify="space-between" margin="20px 0">
        <FlexWrapper direction="column" align="start" gap="3px" width="33%">
          <GreyText>Title</GreyText>
          <Tooltip title={data?.title}>
            <DarkText
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: '95%'
              }}>
              {data?.title}
            </DarkText>
          </Tooltip>
        </FlexWrapper>
        <FlexWrapper direction="column" align="start" gap="3px" width="33%">
          <GreyText>Approved by client</GreyText>
          <DarkText>{data?.client_approved ? 'Yes' : 'No'}</DarkText>
        </FlexWrapper>
        <FlexWrapper direction="column" align="start" gap="3px" width="33%">
          <GreyText>No of Hours Approve</GreyText>
          <DarkText>{data?.no_of_hours}hrs</DarkText>
        </FlexWrapper>
      </FlexWrapper>
      {data?.requestModule?.length > 0 &&
        data?.requestModule?.map((el, idx) => (
          <FlexWrapper
            key={idx}
            direction="column"
            align="start"
            gap="3px"
            margin="20px 0"
            cursor="auto">
            {el?.link_url && (
              <>
                <p style={{ margin: 0 }}>Link URL</p>
                <a
                  href={el?.link_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ margin: 0, color: '#7C71FF', textDecoration: 'none' }}>
                  {el?.link_url}
                </a>
              </>
            )}
          </FlexWrapper>
        ))}
      <FlexWrapper direction="column" align="start" gap="6px" margin="20px 0">
        <GreyText>Description</GreyText>
        <TextArea readOnly rows={5} value={data?.description} />
      </FlexWrapper>
      {data?.requestDocumentModule?.length > 0 &&
        data?.requestDocumentModule?.map((el, idx) => (
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

ChangeRequestInfoModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  data: PropTypes.object
};

export default ChangeRequestInfoModal;
