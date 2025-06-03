import React, { useEffect, useState } from 'react';
import { DarkText, FlexWrapper, PurpleText } from '../../../theme/common_style';
import Title from 'antd/es/typography/Title';
import { Button, Table } from 'antd';
import {
  DeleteIcon,
  EditIcon,
  NoMilestone,
  TrashIconNew,
  ViewIconNew
} from '../../../theme/SvgIcons';
import ChangeRequestInfoModal from './ChangeRequestInfoModal';
import CreateRequestModal from './CreateRequestModal';
import { deleteChangeRequestApi, getChangeRequestsApi } from '../../../redux/project/apiRoute';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import { useSelector } from 'react-redux';
import { checkPermission } from '../../../utils/common_functions';
import { deleteS3Object } from '../../../utils/uploadS3Bucket';

const ChangeRequest = () => {
  const [infoModal, setInfoModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [clickedData, setClickedData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'Projects';
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Approved by client',
      dataIndex: 'client_approved',
      key: 'client_approved',
      render: (text) => (text ? 'Yes' : 'No')
    },
    {
      title: 'No of Hours',
      dataIndex: 'no_of_hours',
      key: 'no_of_hours'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <p
          style={{
            maxWidth: '210px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textWrap: 'nowrap'
          }}>
          {text}
        </p>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      className: 'action-column',
      render: (_, data) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'}>
            <FlexWrapper
              onClick={() => {
                setClickedData(data);
                setInfoModal(true);
              }}
              style={{
                backgroundColor: '#7C71FF',
                width: '30px',
                height: '30px',
                borderRadius: '50%'
              }}>
              <ViewIconNew />
            </FlexWrapper>
            {canUpdate && (
              <FlexWrapper
                onClick={() => {
                  setClickedData(data);
                  setCreateModal(true);
                }}
                style={{
                  backgroundColor: '#65BEEE',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%'
                }}>
                <EditIcon />
              </FlexWrapper>
            )}
            {canDelete && (
              <FlexWrapper
                onClick={() => {
                  setDeleteModal(true);
                  setClickedData(data);
                }}
                style={{
                  backgroundColor: '#FB4A49',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%'
                }}>
                <DeleteIcon />
              </FlexWrapper>
            )}
          </FlexWrapper>
        );
      }
    }
  ];

  const handleGetList = async () => {
    try {
      setLoading(true);
      let res = await getChangeRequestsApi(id);
      if (res?.statusCode === 200) {
        setTableData(res?.data || []);
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
      let res = await deleteChangeRequestApi(clickedData?.id);
      if (res?.statusCode === 200) {
        let paths = clickedData?.requestDocumentModule?.[0]?.document;
        if (paths) {
          await deleteS3Object(paths);
        }
        toast.success(res?.message || 'Successfully deleted');
        handleGetList();
        setDeleteModal(false);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    handleGetList();
  }, []);

  return (
    <>
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Request'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this request?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      <FlexWrapper justify="space-between" margin="0 0 20px">
        <Title level={4} style={{ margin: 0 }}>
          Change Request
        </Title>
        {canCreate && (
          <PurpleText
            onClick={() => {
              setCreateModal(true);
              setClickedData(null);
            }}>
            + Change Request Module
          </PurpleText>
        )}
      </FlexWrapper>
      {loading || tableData.length > 0 ? (
        <Table
          prefixCls="antCustomTable"
          columns={columns}
          dataSource={tableData}
          loading={loading}
          pagination={false}
        />
      ) : (
        <FlexWrapper margin="60px 20px" direction="column">
          <NoMilestone />
          <Title level={5} style={{ margin: '10px 0 0' }}>
            No Change Request
          </Title>
          <DarkText weight="400">
            No change request created yet kindly create first change request
          </DarkText>
          {canCreate && (
            <Button
              prefixCls="antCustomBtn"
              style={{ margin: '16px 0' }}
              onClick={() => setCreateModal(true)}>
              + Change Request Module
            </Button>
          )}
        </FlexWrapper>
      )}
      {infoModal && (
        <ChangeRequestInfoModal
          data={clickedData}
          open={infoModal}
          onCancel={() => {
            setInfoModal(false);
            setClickedData(null);
          }}
        />
      )}
      {createModal && (
        <CreateRequestModal
          open={createModal}
          onCancel={() => {
            setCreateModal(false);
          }}
          editDetails={clickedData}
          handleListing={handleGetList}
        />
      )}
    </>
  );
};

export default ChangeRequest;
