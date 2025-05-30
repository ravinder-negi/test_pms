import { Button, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import {
  DarkText,
  DeleteIconBox,
  EditIconBox,
  FlexWrapper,
  PurpleText,
  ViewIconBox
} from '../../../theme/common_style';
import {
  DeleteIcon,
  EditIcon,
  NoMilestone,
  TrashIconNew,
  ViewIconNew
} from '../../../theme/SvgIcons';
import MilestoneInfoModal from './MilestoneInfoModal';
import { useSelector } from 'react-redux';
import CreateMilestone from './CreateMilestone';
import { toast } from 'react-toastify';
import { deleteMilestoneApi, getMilestoneList } from '../../../redux/project/apiRoute';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { milestoneStatusOption } from '../../../utils/constant';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import {
  activeStatusTag,
  checkPermission,
  generateEmployeeImgUrl,
  getFullName
} from '../../../utils/common_functions';
import { AvatarGroup } from '../../../components/common/AvatarGroup';
import { deleteS3Object } from '../../../utils/uploadS3Bucket';

const Milestone = () => {
  const [infoModal, setInfoModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [currentlyViewing, setCurrentlyViewing] = useState(null);
  const [tableData, setTableData] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'Projects';
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const [sort, setSort] = useState({});

  const handleSorting = (val) => {
    if (val?.field) {
      let order = val?.order == 'ascend' ? 'ASC' : 'DESC';
      setSort({ sortBy: val?.field, orderBy: order, ...val });
    } else {
      setSort({});
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Assignee',
      dataIndex: 'project_milestone_assignee',
      key: 'project_milestone_assignee',
      render: (data) => {
        let projectMilestone =
          data?.map((val) => {
            let fullName = getFullName(
              val?.assignee_details?.first_name,
              val?.assignee_details?.middle_name,
              val?.assignee_details?.last_name
            );
            return {
              name: fullName,
              src: generateEmployeeImgUrl(val?.assignee_details?.id),
              id: val?.assignee_details?.id
            };
          }) || [];
        return (
          <FlexWrapper justify={'start'} gap={'6px'}>
            {projectMilestone?.length > 0 ? <AvatarGroup avatars={projectMilestone} /> : 'N/A'}
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Priority Label',
      dataIndex: 'status',
      key: 'status',
      render: (priority) => activeStatusTag(milestoneStatusOption, 'id', priority)
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      sorter: true,
      render: (text) => (text ? moment(text).format('DD MMM YYYY') : '')
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      sorter: true,
      render: (text) => (text ? moment(text).format('DD MMM YYYY') : '')
    },
    {
      title: 'Milestone',
      dataIndex: 'milestone_detail',
      key: 'milestone_detail',
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
          <FlexWrapper justify={'start'} wrap="nowrap" gap={'6px'}>
            <ViewIconBox
              onClick={() => {
                setCurrentlyViewing(data);
                setInfoModal(true);
              }}>
              <ViewIconNew />
            </ViewIconBox>

            {canUpdate && (
              <EditIconBox
                canUpdate={canUpdate}
                onClick={() => {
                  if (canUpdate) {
                    setCurrentlyViewing(data);
                    setCreateModal(true);
                  }
                }}>
                <EditIcon />
              </EditIconBox>
            )}
            {canDelete && (
              <DeleteIconBox
                canDelete={canDelete}
                onClick={() => {
                  if (canDelete) {
                    setDeleteModal(true);
                    setCurrentlyViewing(data);
                  }
                }}>
                <DeleteIcon />
              </DeleteIconBox>
            )}
          </FlexWrapper>
        );
      }
    }
  ];

  const handleGetList = async () => {
    try {
      setLoading(true);
      let params = new URLSearchParams();
      sort?.sortBy && params.append('sortBy', sort?.sortBy);
      sort?.orderBy && params.append('sortOrder', sort?.orderBy);
      let res = await getMilestoneList(id, params);
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
      let res = await deleteMilestoneApi(currentlyViewing?.id);
      if (res?.statusCode === 200) {
        let paths = currentlyViewing?.milestone_documents?.[0]?.document;
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
  }, [sort]);

  return (
    <>
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Milestone'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this milestone?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      <MilestoneInfoModal
        open={infoModal}
        onCancel={() => {
          setInfoModal(false);
          setCurrentlyViewing(null);
        }}
        data={currentlyViewing}
      />

      {createModal && (
        <CreateMilestone
          open={createModal}
          onCancel={() => {
            setCreateModal(false);
            setCurrentlyViewing(null);
          }}
          editDetails={currentlyViewing}
          handleListing={handleGetList}
        />
      )}
      <FlexWrapper justify="space-between" width="100%">
        <Title level={4} style={{ textAlign: 'left', margin: '0 0 14px' }}>
          Milestone
        </Title>
        {canCreate && (
          <PurpleText onClick={() => setCreateModal(true)}>+ Create New Milestone</PurpleText>
        )}
      </FlexWrapper>
      {loading || tableData.length > 0 ? (
        <Table
          prefixCls="antCustomTable"
          columns={columns}
          dataSource={tableData}
          loading={loading}
          pagination={false}
          onChange={(newPagination, filters, sorter) => {
            handleSorting(sorter);
          }}
          defaultSortOrder={sort.order}
        />
      ) : (
        <FlexWrapper margin="60px 20px" direction="column">
          <NoMilestone />
          <Title level={5} style={{ margin: '10px 0 0' }}>
            No Milestone
          </Title>
          <DarkText weight="400">No milestone created yet kindly create first milestone</DarkText>
          {canCreate && (
            <Button
              prefixCls="antCustomBtn"
              style={{ margin: '6px 0' }}
              onClick={() => setCreateModal(true)}>
              + Create New Milestone
            </Button>
          )}
        </FlexWrapper>
      )}
    </>
  );
};

export default Milestone;
