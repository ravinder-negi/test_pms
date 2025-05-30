import React, { useState } from 'react';
import { DeleteIconBox, EditIconBox, FlexWrapper, LinkStyled } from '../../theme/common_style';
import { DeleteIcon, EditIcon, HistoryIcon, TrashIconNew } from '../../theme/SvgIcons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import colors from '../../theme/colors';
import { Drawer, Segmented } from 'antd';
import '../../theme/antCustomComponents.css';
import styled from '@emotion/styled/macro';
import GeneralInfo from './generalInfo/GeneralInfo';
import ChangeRequest from './changeRequest/ChangeRequest';
import Milestone from './milestone/Milestone';
import { useDispatch, useSelector } from 'react-redux';
import ProjectActivity from './ProjectActivity';
import ProjectDocuments from './document/Documents';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import { deleteProjectApi } from '../../redux/project/apiRoute';
import { toast } from 'react-toastify';
import AddProject from './AddProject';
import { checkPermission } from '../../utils/common_functions';
import ProjectReporting from './reporting/ProjectReporting';
import { updateActiveTabPro } from '../../redux/project/ProjectSlice';

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state?.projectSlice?.activeTabPro);
  const [activityDrawer, setActivityDrawer] = useState(false);
  const location = useLocation();
  const { project, name } = location.state || {};
  const { isEmployee } = useSelector((e) => e.userInfo);
  const { id } = useParams();
  const [editData, setEditData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const [editModal, setEditModal] = useState(false);
  const [updated, setUpdated] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'Projects';
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);

  const handleProjectList = () => {
    setUpdated(!updated);
  };

  const handleDelete = async () => {
    if (id) {
      try {
        setDeleteLoading(true);
        let res = await deleteProjectApi(id);
        if (res?.statusCode === 200) {
          navigate('/project');
          setDeleteModal(false);
        } else {
          toast.error(res?.message || 'Something went wrong');
        }
      } catch (err) {
        toast.error(err?.message || 'Something went wrong');
      } finally {
        setDeleteLoading(false);
      }
    } else {
      toast.error('Project not found');
    }
  };

  return (
    <div>
      {editModal && (
        <AddProject
          open={editModal}
          close={() => setEditModal(false)}
          handleProjectList={handleProjectList}
          editDetails={editData}
        />
      )}
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Project'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this project?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      {activityDrawer && (
        <Drawer
          width={490}
          title="Activity"
          placement="right"
          closable={true}
          prefixCls="activityCustomDrawer"
          onClose={() => setActivityDrawer(false)}
          open={activityDrawer}
          key="right">
          <ProjectActivity projectId={id} />
        </Drawer>
      )}
      <FlexWrapper justify="space-between">
        <div>
          <LinkStyled to="/project">Project</LinkStyled> / {name}
        </div>
        <FlexWrapper
          gap="6px"
          style={{ cursor: 'pointer' }}
          onClick={() => setActivityDrawer(true)}>
          <HistoryIcon color={colors.darkSkyBlue} />
          <p style={{ color: colors.darkSkyBlue }}>Activity</p>
        </FlexWrapper>
      </FlexWrapper>
      <FlexWrapper justify="space-between">
        <Segmented
          prefixCls="antCustomSegmented"
          options={['General Info', 'Documents', 'Change Request', 'Milestone', 'Reporting']}
          value={selectedTab}
          onChange={(value) => {
            dispatch(updateActiveTabPro(value));
          }}
        />
        {!isEmployee && selectedTab === 'General Info' && (
          <FlexWrapper gap="6px">
            {canUpdate && (
              <EditIconBox canUpdate={canUpdate} onClick={() => setEditModal(true)}>
                <EditIcon />
              </EditIconBox>
            )}
            {canDelete && (
              <DeleteIconBox canDelete={canDelete} onClick={() => setDeleteModal(true)}>
                <DeleteIcon />
              </DeleteIconBox>
            )}
          </FlexWrapper>
        )}
      </FlexWrapper>
      <ContentWrapper>
        {selectedTab === 'General Info' && (
          <GeneralInfo
            setEditData={setEditData}
            updated={updated}
            editData={editData}
            project={project}
          />
        )}
        {selectedTab === 'Documents' && <ProjectDocuments />}
        {selectedTab === 'Change Request' && <ChangeRequest />}
        {selectedTab === 'Milestone' && <Milestone />}
        {selectedTab === 'Reporting' && <ProjectReporting />}
      </ContentWrapper>
    </div>
  );
};

export default ProjectDetails;

const ContentWrapper = styled.div`
  margin: 20px 0 0 !important;
`;
