import PropTypes from 'prop-types';
import NoData from '../../../../components/common/NoData';
import { AllDocsStyle, DocCardStyle, GridContainer } from './EmpDocStyle';
import { Skeleton } from 'antd';
import DocCards from './DocCards';
import {
  ArrowDownIcon,
  DocDeleteIcon,
  DocDownloadIcon,
  DocFolderIcon,
  SelectCheckIcon
} from '../../../../theme/SvgIcons';
import { useSelector } from 'react-redux';
import { checkPermission, currentModule } from '../../../../utils/common_functions';

const DocumentComp = ({
  loading,
  cardData,
  selectedCheckbox,
  setSelectedCheckbox,
  handleCheckbox,
  handleDownload,
  handleDelete,
  handleCollection
}) => {
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const permissionSection = currentModule();
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);

  return (
    <AllDocsStyle>
      {selectedCheckbox?.length > 0 && (
        <div className="selected-docs">
          <div className="row">
            <div onClick={() => setSelectedCheckbox([])}>
              <SelectCheckIcon />
            </div>
            <div>
              <ArrowDownIcon />
            </div>
            <p className="selected-text">{selectedCheckbox?.length} Selected</p>
          </div>
          <div>
            <div className="action">
              <div onClick={() => handleDownload(selectedCheckbox)}>
                <DocDownloadIcon size={18} />
              </div>
              {canUpdate && (
                <>
                  <div className="line" />
                  <div onClick={() => handleCollection(true)}>
                    <DocFolderIcon size={22} />
                  </div>
                </>
              )}
              {canDelete && (
                <>
                  <div className="line" />
                  <div style={{ color: 'red' }} onClick={() => handleDelete(true)}>
                    <DocDeleteIcon size={18} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {!loading && cardData?.length === 0 ? (
        <NoData
          title="No Document"
          subTitle="No document uploaded yet kindly upload document"
          height={'350px'}
        />
      ) : loading ? (
        <GridContainer>
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </GridContainer>
      ) : (
        <GridContainer>
          {cardData?.map((item, index) => (
            <DocCards
              data={item}
              key={index}
              idx={index}
              isChecked={selectedCheckbox?.find((el) => el.id === item.id)}
              handleCheckbox={handleCheckbox}
              hideIcons={selectedCheckbox?.length > 0}
              canDelete={canDelete}
              canUpdate={canUpdate}
              downloadFile={handleDownload}
              handleDelete={handleDelete}
              handleCollection={handleCollection}
              allDocs={cardData}
            />
          ))}
        </GridContainer>
      )}
    </AllDocsStyle>
  );
};

export default DocumentComp;

DocumentComp.propTypes = {
  loading: PropTypes.bool,
  cardData: PropTypes.array,
  selectedCheckbox: PropTypes.array,
  setSelectedCheckbox: PropTypes.func,
  handleCheckbox: PropTypes.func,
  handleDownload: PropTypes.func,
  handleDelete: PropTypes.func,
  handleCollection: PropTypes.func
};

const CardSkeleton = () => {
  return (
    <DocCardStyle>
      <div className="upper-container">
        <Skeleton.Image active />
      </div>
      <div className="lower-container">
        <Skeleton title={false} active paragraph={{ rows: 1 }} />
      </div>
    </DocCardStyle>
  );
};
