import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { FlexWrapper } from '../../../../theme/common_style';
import { DocPreviewDelete, DocPreviewDownload, DocPreviewFolder } from '../../../../theme/SvgIcons';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import ExcelPreview from './ExcelPreview';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { checkPermission, currentModule } from '../../../../utils/common_functions';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const DocPreview = ({
  open,
  onClose,
  allData,
  activeIndex,
  handleDelete,
  handleCollection,
  handleDownload
}) => {
  if (!open) return null;
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const permissionSection = currentModule();
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);

  const baseUrl = process.env.REACT_APP_S3_BASE_URL;
  const [active, setActive] = useState(activeIndex || 0);
  const data = allData || [];
  const len = data?.length - 1;

  const handlePre = () => {
    if (active > 0) setActive(active - 1);
  };

  const handleNext = () => {
    if (active < data.length - 1) setActive(active + 1);
  };

  const { fileUrl, created_at, file_size, file_extension } = useMemo(
    () => ({ fileUrl: baseUrl + data[active]?.document, ...data[active] }),
    [active, data]
  );

  const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
    if (['xls', 'xlsx'].includes(extension)) return 'excel';
    if (['pdf'].includes(extension)) return 'pdf';
    return 'unknown';
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const fileType = fileUrl && getFileType(fileUrl);

  const fileName = (fileUrl) => {
    return fileUrl?.split('/')?.pop();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePre();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, data.length]);

  return (
    <Overlay>
      <FlexWrapper width="100%" cursor="default">
        <ViewContiner>
          <FlexWrapper width="100%" cursor="default" justify="space-between">
            <NavigationBtn onClick={handleOverlayClick}>
              <CloseOutlined />
            </NavigationBtn>
            <FlexWrapper
              gap="9px"
              width="calc(100% - 64px)"
              justify="center"
              margin="0 32px 0 0"
              cursor="default">
              <ActionBtn onClick={() => handleDownload(data[active])}>
                <DocPreviewDownload />
              </ActionBtn>
              {canUpdate && (
                <ActionBtn onClick={() => handleCollection(data[active])}>
                  <DocPreviewFolder />
                </ActionBtn>
              )}
              {canDelete && (
                <ActionBtn
                  border="1px solid transparent"
                  onClick={() => handleDelete(data[active])}>
                  <DocPreviewDelete />
                </ActionBtn>
              )}
            </FlexWrapper>
          </FlexWrapper>
          <FlexWrapper
            justify={data?.length > 1 ? 'space-between' : 'center'}
            width="100%"
            cursor="default"
            style={{ height: 'calc(100vh - 110px)' }}>
            {data?.length > 1 && (
              <NavigationBtn opacity={active == 0} onClick={handlePre}>
                <LeftOutlined />
              </NavigationBtn>
            )}
            <FlexWrapper width="calc(100% - 110px)" style={{ height: '100%' }} cursor="default">
              {fileType === 'image' && (
                <img
                  src={fileUrl}
                  alt="Preview"
                  style={{ width: '100%', height: 'calc(100vh - 110px)', objectFit: 'contain' }}
                />
              )}
              {fileType === 'video' && (
                <video
                  src={fileUrl}
                  controls
                  style={{ width: '100%', height: 'calc(100vh - 110px)', objectFit: 'contain' }}
                />
              )}
              {fileType === 'excel' && <ExcelPreview fileUrl={fileUrl} />}
              {fileType === 'pdf' && (
                <iframe
                  src={fileUrl}
                  title="PDF Preview"
                  style={{ width: '100%', height: 'calc(100vh - 110px)' }}
                />
              )}
              {fileType === 'unknown' && <div>Unsupported file type</div>}
            </FlexWrapper>
            {data?.length > 1 && (
              <NavigationBtn
                opacity={len == active}
                onClick={() => {
                  len !== active && handleNext();
                }}>
                <RightOutlined />
              </NavigationBtn>
            )}
          </FlexWrapper>
        </ViewContiner>
        <DetailContainer>
          <div className="label">{fileName(fileUrl)}</div>

          <FlexWrapper align="flex-start" gap="1px" direction="column" cursor="defalut">
            <div className="subLabel">Uploaded Date</div>
            <div className="info">{moment(created_at).format('DD MMM,YYYY')}</div>
          </FlexWrapper>
          <hr />
          <div className="label">General Info</div>

          <FlexWrapper gap="30px" justify="start" cursor="defalut">
            <FlexWrapper align="flex-start" gap="1px" direction="column">
              <div className="subLabel">Size</div>
              <div className="info">{file_size || 'N/A'}</div>
            </FlexWrapper>
            <FlexWrapper align="flex-start" gap="1px" direction="column">
              <div className="subLabel">File Format</div>
              <div className="info">{file_extension}</div>
            </FlexWrapper>
          </FlexWrapper>
        </DetailContainer>
      </FlexWrapper>
    </Overlay>
  );
};

export default DocPreview;

DocPreview.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  allData: PropTypes.array.isRequired,
  activeIndex: PropTypes.number,
  handleDelete: PropTypes.func,
  handleCollection: PropTypes.func,
  handleDownload: PropTypes.func
};

const ViewContiner = styled.div`
  width: calc(100% - 400px);
  height: 100vh;
  z-index: 999;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;

  @media (max-width: 1366px) {
    width: calc(100% - 300px);
  }
`;

const DetailContainer = styled.div`
  width: 400px;
  height: 100vh;
  background: #fff;
  padding: 24px;
  display: flex;
  gap: 10px;
  flex-direction: column;

  @media (max-width: 1366px) {
    width: 300px;
  }

  hr {
    width: 100%;
  }

  .label {
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 16px;
    text-align: start;
  }

  .subLabel {
    color: #818b9a;
    font-size: 12px;
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    line-height: 140%;
  }

  .info {
    font-size: 12px;
    font-family: 'Plus Jakarta Sans';
    font-weight: 600;
    line-height: 160%;
  }
`;

const NavigationBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0;
  opacity: ${({ opacity }) => (opacity ? 0 : 1)};
`;

const ActionBtn = styled.button`
  border: transparent;
  border-right: ${({ border }) => border || '1px solid rgba(255, 255, 255, 0.4)'};
  height: 24px;
  padding-right: 9px;
  cursor: pointer;
  border-radius: 0;
  background-color: transparent;
`;
