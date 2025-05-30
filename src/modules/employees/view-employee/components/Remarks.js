import React, { useEffect, useState } from 'react';
import { OfficialIdsStyle, RemarkGrid } from '../ViewEmployeeStyle';
import {
  DeleteIconBox,
  EditIconBox,
  FlexWrapper,
  GreyText,
  PurpleText
} from '../../../../theme/common_style';
import { DeleteIcon, EditIcon, TrashIconNew } from '../../../../theme/SvgIcons';
import { Skeleton } from 'antd';
import {
  deleteEmployeeRemarksApi,
  getEmployeeRemarksApi
} from '../../../../redux/employee/apiRoute';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { checkPermission } from '../../../../utils/common_functions';
import AddRemarks from '../modals/AddRemarks';
import NoData from '../../../../components/common/NoData';
import moment from 'moment';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import { toast } from 'react-toastify';
import ViewRemarks from '../modals/ViewRemarks';

const Remarks = () => {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const { id } = useParams();
  const [addModal, setAddModal] = useState(false);
  const [editDetails, setEditDetails] = useState(null);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const location = useLocation();
  let permissionSection = location?.pathname?.includes('my-profile') ? 'my-profile' : 'Employee';
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const handleGetRemarks = async () => {
    try {
      setLoading(true);
      let res = await getEmployeeRemarksApi(id);
      if (res?.statusCode === 200) {
        setCards(res?.data);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      let res = await deleteEmployeeRemarksApi(editDetails?.id);
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Remark deleted successfully');
        setDeleteModal(false);
        handleGetRemarks();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    handleGetRemarks();
  }, []);

  return (
    <OfficialIdsStyle>
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Remarks'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this remarks?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      {addModal && (
        <AddRemarks
          open={addModal}
          onClose={() => setAddModal(false)}
          editDetails={editDetails}
          handleList={handleGetRemarks}
        />
      )}
      {viewModal && (
        <ViewRemarks
          open={viewModal}
          onClose={() => setViewModal(false)}
          editDetails={editDetails}
        />
      )}
      <div className="title">
        <h5>Remarks</h5>
        {canCreate && (
          <p
            onClick={() => {
              setAddModal(true);
              setEditDetails(null);
            }}>
            + Add Remark
          </p>
        )}
      </div>
      {loading ? (
        <RemarkGrid>
          <div className="card">
            <Skeleton active title={false} paragraph={{ rows: 5 }} />
            <div style={{ marginTop: 16 }}>
              <Skeleton.Button active block style={{ height: 40 }} />
            </div>
          </div>
          <div className="card">
            <Skeleton active title={false} paragraph={{ rows: 5 }} />
            <div style={{ marginTop: 16 }}>
              <Skeleton.Button active block style={{ height: 40 }} />
            </div>
          </div>
          <div className="card">
            <Skeleton active title={false} paragraph={{ rows: 5 }} />
            <div style={{ marginTop: 16 }}>
              <Skeleton.Button active block style={{ height: 40 }} />
            </div>
          </div>
        </RemarkGrid>
      ) : (
        <RemarkGrid>
          {cards?.map((el, idx) => (
            <FlexWrapper
              key={idx}
              className="card"
              justify="space-between"
              direction="column"
              align="flex-start"
              gap="16px"
              style={{ minHeight: '176px' }}>
              <FlexWrapper justify="space-between" width="100%">
                <div className="name">
                  <h5>{el?.title}</h5>
                  <p>{moment(el?.created_at).format('DD MMM, YYYY')}</p>
                </div>
                <FlexWrapper gap="5px">
                  {canUpdate && (
                    <EditIconBox
                      canUpdate={canUpdate}
                      onClick={() => {
                        setEditDetails(el);
                        setAddModal(true);
                      }}>
                      <EditIcon />
                    </EditIconBox>
                  )}
                  {canDelete && (
                    <DeleteIconBox
                      canDelete={canDelete}
                      onClick={() => {
                        setEditDetails(el);
                        setDeleteModal(true);
                      }}>
                      <DeleteIcon />
                    </DeleteIconBox>
                  )}
                </FlexWrapper>
              </FlexWrapper>
              <GreyText style={{ textAlign: 'start' }}>
                {el?.remarks?.length > 80 ? `${el.remarks.slice(0, 80)}...` : el?.remarks}
              </GreyText>
              <PurpleText
                size="16px"
                onClick={() => {
                  setViewModal(true);
                  setEditDetails(el);
                }}>
                See Full Remark
              </PurpleText>
            </FlexWrapper>
          ))}
        </RemarkGrid>
      )}
      {!loading && cards?.length === 0 && (
        <NoData
          title="No Remarks"
          subTitle="No Remarks created yet kindly create Remarks"
          buttonText={canCreate ? '+ Add Remark' : null}
          handleBtn={
            canCreate
              ? () => {
                  setAddModal(true);
                  setEditDetails(null);
                }
              : null
          }
          height={'350px'}
        />
      )}
    </OfficialIdsStyle>
  );
};

export default Remarks;
