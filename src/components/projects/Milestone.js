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
} from '../../theme/common_style';
import { DeleteIcon, EditIcon, NoMilestone, TrashIconNew, ViewIconNew } from '../../theme/SvgIcons';
import MilestoneInfoModal from '../Modal/MilestoneInfoModal';
import { useSelector } from 'react-redux';
import CreateMilestone from './CreateMilestone';
import { toast } from 'react-toastify';
import { deleteMilestoneApi, getMilestoneList } from '../../redux/project/apiRoute';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { milestoneStatusOption } from '../../utils/constant';
import ConfirmationModal from '../Modal/ConfirmationModal';
import { checkPermission, getFullName } from '../../utils/common_functions';
import AvatarGroupExample from '../common/AvatarGroup';
import { deleteS3Object } from '../../utils/uploadS3Bucket';

const image_end = 'employee/profileImg/';

const hexToRgba = (hex, alpha = 0.2) => {
  const r = parseInt(hex?.slice(1, 3), 16);
  const g = parseInt(hex?.slice(3, 5), 16);
  const b = parseInt(hex?.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getPriorityStatus = (status) => {
  let filteredStatus = milestoneStatusOption.find((el) => el.id === status);
  return (
    <div
      style={{
        width: 'max-content',
        minWidth: '80px',
        padding: '5px 10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: hexToRgba(filteredStatus?.color, 0.2),
        color: filteredStatus?.color,
        borderRadius: '20px',
        fontSize: 12,
        fontWeight: 500
      }}>
      {filteredStatus?.name}
    </div>
  );
};

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
            let imgUrl = process.env.REACT_APP_S3_BASE_URL + image_end + val?.assignee_details?.id;
            return { name: fullName, src: imgUrl };
          }) || [];
        return (
          <FlexWrapper justify={'start'} gap={'6px'}>
            {projectMilestone?.length > 0 ? (
              <AvatarGroupExample avatars={projectMilestone} />
            ) : (
              'N/A'
            )}
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Priority Label',
      dataIndex: 'status',
      key: 'status',
      render: (priority) => getPriorityStatus(priority)
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
    // {
    //   title: 'Progress',
    //   render: () => (
    //     <Progress
    //       size={45}
    //       strokeWidth={10}
    //       type="circle"
    //       percent={75}
    //       strokeColor={{
    //         '50%': '#108ee9',
    //         '100%': '#87d068'
    //       }}
    //     />
    //   )
    // },
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
