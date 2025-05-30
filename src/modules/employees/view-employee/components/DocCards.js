import React, { useState } from 'react';
import { ActionTabStyled, CheckBoxStyled, DocCardStyle } from './EmpDocStyle';
import {
  DocPdfIcon,
  DocDownloadIcon,
  DocFolderIcon,
  InfoIcon,
  DocDeleteIcon,
  ExcelIcon
} from '../../../../theme/SvgIcons';
import PropTypes from 'prop-types';
import moment from 'moment';
import DocPreview from './DocPreview';
import { Skeleton } from 'antd';

const DocCards = ({
  data,
  idx,
  isChecked,
  handleCheckbox,
  hideIcons,
  canDelete,
  canUpdate,
  downloadFile,
  handleDelete,
  handleCollection,
  allDocs
}) => {
  let docType = data?.document?.split('.').pop();
  let docName = data?.document?.split('/').pop();
  const [openPreview, setOpenPreview] = useState(false);
  const [load, setLoad] = useState(true);

  const handleCheck = () => {
    handleCheckbox(data);
  };

  return (
    <>
      <DocCardStyle key={idx} checkbox={isChecked}>
        <div className="upper-container" onClick={() => setOpenPreview(true)}>
          <CheckBoxStyled
            type="checkbox"
            name="checkbox"
            checked={isChecked}
            className="checkbox"
            onClick={(e) => {
              e.stopPropagation();
              handleCheck();
            }}
          />
          {!hideIcons && (
            <ActionTabStyled className="action">
              <i
                onClick={(e) => {
                  e.stopPropagation();
                  downloadFile(data);
                }}>
                <DocDownloadIcon />
              </i>
              {canUpdate && (
                <>
                  <div className="line" />
                  <i
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCollection(data);
                    }}>
                    <DocFolderIcon />
                  </i>
                </>
              )}
              {canDelete && (
                <>
                  <div className="line" />
                  <i
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(data);
                    }}>
                    <DocDeleteIcon />
                  </i>
                </>
              )}
            </ActionTabStyled>
          )}
          {docType === 'xls' || docType === 'xlsx' ? (
            <ExcelIcon />
          ) : docType === 'pdf' ? (
            <DocPdfIcon />
          ) : (
            <>
              {load && <Skeleton.Image active />}
              <img
                src={process.env.REACT_APP_S3_BASE_URL + data?.document}
                alt=""
                onLoad={() => {
                  console.log('loaded');
                  setLoad(false);
                }}
                style={{ display: load ? 'none' : 'block' }}
              />
            </>
          )}
        </div>
        <div className="lower-container">
          <div className="text">{docName}</div>
          <div className="info">
            <div className="date">
              {moment(data?.createdAt).format('DD MMM YYYY')}
              {data?.file_size && <div className="dot" />}
              {data?.file_size}
            </div>
            <i>
              <InfoIcon />
            </i>
          </div>
        </div>
      </DocCardStyle>
      <DocPreview
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        allData={allDocs}
        activeIndex={idx}
        handleDelete={handleDelete}
        handleCollection={handleCollection}
        handleDownload={downloadFile}
      />
    </>
  );
};

export default DocCards;

DocCards.propTypes = {
  data: PropTypes.object,
  idx: PropTypes.number,
  isChecked: PropTypes.bool,
  handleCheckbox: PropTypes.func,
  hideIcons: PropTypes.bool,
  canDelete: PropTypes.bool,
  canUpdate: PropTypes.bool,
  downloadFile: PropTypes.func,
  handleDelete: PropTypes.func,
  handleCollection: PropTypes.func,
  showFolder: PropTypes.bool,
  allDocs: PropTypes.array
};
