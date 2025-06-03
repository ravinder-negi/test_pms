import PropTypes from 'prop-types';
import {
  AddCardStyle,
  CardStyle,
  CollectionStyle,
  ContentStyle,
  DocCardStyle,
  GridContainer
} from './EmpDocStyle';
import { Popover, Skeleton } from 'antd';
import {
  AddCollectionIcon,
  ColoredFolderIcon,
  DocDeleteIcon,
  EditCollection,
  InfoIcon,
  ThreeDotIcon
} from '../../../../theme/SvgIcons';
import { checkPermission } from '../../../../utils/common_functions';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useCurrentModule } from '../../../../hooks/useCurrentModule';

const CollectionComp = ({
  loading,
  collections,
  handleCreateModal,
  handleCardClick,
  handAction
}) => {
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const permissionSection = useCurrentModule();
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);

  return (
    <CollectionStyle>
      {loading ? (
        <GridContainer>
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </GridContainer>
      ) : (
        <GridContainer>
          {canCreate && (
            <AddCardStyle onClick={() => handleCreateModal(true)}>
              <AddCollectionIcon />
              <div className="text">Create New Collection</div>
            </AddCardStyle>
          )}
          {collections?.map((val, index) => (
            <CardStyle key={index} onClick={() => handleCardClick(val)}>
              <div className="nav">
                <ColoredFolderIcon />
                <ThreeDotSection
                  val={val}
                  handAction={handAction}
                  index={index}
                  canDelete={canDelete}
                  canUpdate={canUpdate}
                />
              </div>
              <div className="text">{val?.collection_name}</div>
              <div className="nav">
                <span className="files">{val?.documentCount} Files</span>
                <div className="infoIcon">
                  <InfoIcon />
                </div>
              </div>
            </CardStyle>
          ))}
        </GridContainer>
      )}
    </CollectionStyle>
  );
};

export default CollectionComp;

CollectionComp.propTypes = {
  loading: PropTypes.bool,
  collections: PropTypes.array,
  handleCreateModal: PropTypes.func,
  handleCardClick: PropTypes.func,
  handAction: PropTypes.func
};

const ThreeDotSection = ({ val, handAction, index, canDelete, canUpdate }) => {
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newVal) => {
    setOpen(newVal);
  };
  return (
    <Popover
      key={index}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      content={
        <ContentStyle>
          {canUpdate && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handAction(val, 'edit');
                hide();
              }}>
              <EditCollection size={20} />
            </div>
          )}
          {canDelete && (
            <div
              style={{ color: 'red' }}
              onClick={(e) => {
                e.stopPropagation();
                handAction(val, 'delete');
                hide();
              }}>
              <DocDeleteIcon size={18} />
            </div>
          )}
        </ContentStyle>
      }>
      {(canDelete || canUpdate) && (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <ThreeDotIcon />
        </div>
      )}
    </Popover>
  );
};

ThreeDotSection.propTypes = {
  val: PropTypes.object,
  handAction: PropTypes.func,
  index: PropTypes.number,
  canDelete: PropTypes.bool,
  canUpdate: PropTypes.bool
};

const CardSkeleton = () => {
  return (
    <DocCardStyle>
      <div className="upper-container">
        <Skeleton title={false} active paragraph={{ rows: 3 }} />
      </div>
    </DocCardStyle>
  );
};
