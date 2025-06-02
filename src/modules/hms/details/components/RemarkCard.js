import React, { useState } from 'react';
import {
  ClickWrapper,
  DeleteIconBox,
  EditIconBox,
  FlexWrapper,
  GreyText,
  PurpleText,
  SkyText
} from '../../../../theme/common_style';
import Title from 'antd/es/typography/Title';
import { ContentWrapper } from '../../common';
import RemarkDetails from '../modals/RemarkDetails';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DeleteIcon, EditIcon, TrashIconNew } from '../../../../theme/SvgIcons';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import { deleteDeviceRemark } from '../../../../services/api_collection';
import { toast } from 'react-toastify';
import AddRemark from '../modals/AddRemark';

const RemarkCard = ({
  title,
  remarks,
  createdAt,
  viewing,
  handleGetRemarkListing,
  deletId,
  val,
  canDelete,
  canUpdate
}) => {
  const [detailsModal, setDetailsModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const handleDeleteRemark = async () => {
    setLoader(true);
    let res = await deleteDeviceRemark(deletId);
    if (res?.statusCode === 200) {
      setLoader(false);
      toast.success(res?.message);
      handleGetRemarkListing();
    } else {
      setLoader(false);
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
    }
  };

  return (
    <ContentWrapper padding={viewing ? '0px' : '16px'}>
      {editModal && (
        <AddRemark
          open={editModal}
          onClose={() => setEditModal(false)}
          handleGetRemarkListing={handleGetRemarkListing}
          val={val}
          editId={deletId}
        />
      )}
      {detailsModal && (
        <RemarkDetails
          open={detailsModal}
          onClose={() => setDetailsModal(false)}
          title={title}
          remarks={remarks}
          createdAt={createdAt}
        />
      )}
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Remarks'}
          onSubmit={handleDeleteRemark}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this remarks?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={loader}
        />
      )}
      <FlexWrapper justify="space-between" direction="column" align="flex-start" gap="16px">
        <FlexWrapper direction="column" align="start" gap="4px" width="100%">
          <div className="hms-remark">
            <Title level={5} style={{ margin: 0 }}>
              {title}
            </Title>
            {!viewing && (
              <FlexWrapper gap="5px">
                {canUpdate && (
                  <ClickWrapper
                    onClick={() => {
                      setEditModal(true);
                    }}>
                    <EditIconBox canUpdate={canUpdate}>
                      <EditIcon />
                    </EditIconBox>
                  </ClickWrapper>
                )}
                {canDelete && (
                  <ClickWrapper
                    onClick={() => {
                      setDeleteModal(true);
                    }}>
                    <DeleteIconBox canDelete={canDelete}>
                      <DeleteIcon />
                    </DeleteIconBox>
                  </ClickWrapper>
                )}
              </FlexWrapper>
            )}
          </div>
          <SkyText>{moment(createdAt).format('DD MMM, YYYY')}</SkyText>
        </FlexWrapper>
        <GreyText size="14px" style={{ textAlign: 'start' }}>
          {remarks?.length > 80 && !viewing ? `${remarks?.slice(0, 80)}...` : remarks}
        </GreyText>
        {!viewing && (
          <ClickWrapper onClick={() => setDetailsModal(true)}>
            <PurpleText size="16px">See Full Remark</PurpleText>
          </ClickWrapper>
        )}
      </FlexWrapper>
    </ContentWrapper>
  );
};

RemarkCard.propTypes = {
  title: PropTypes.string.isRequired,
  remarks: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  viewing: PropTypes.bool,
  handleGetRemarkListing: PropTypes.func,
  deletId: PropTypes.string,
  val: PropTypes.any,
  canDelete: PropTypes.bool,
  canUpdate: PropTypes.bool
};

export default RemarkCard;
