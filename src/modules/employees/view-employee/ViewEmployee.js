import React, { useEffect, useRef, useState } from 'react';
import BasicInfo from './components/BasicInfo';
import {
  DeleteIconBox,
  FlexWrapper,
  LinkStyled,
  UpdateKeyIconBox
} from '../../../theme/common_style';
import { DeleteIcon, HistoryIcon, TrashIconNew, UpdateKeyIcon } from '../../../theme/SvgIcons';
import colors from '../../../theme/colors';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Drawer, Segmented } from 'antd';
import GeneralInfo from './components/GeneralInfo';
import EmployeeDocuments from './components/EmployeeDocuments';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveTab } from '../../../redux/employee/EmployeeSlice';
import SalaryInfo from './components/SalaryInfo';
import Remarks from './components/Remarks';
import { toast } from 'react-toastify';
import { deleteEmployeeApi, viewEmployeeApi } from '../../../redux/employee/apiRoute';
import ActivityEmployee from '../ActivityEmployee';
import { checkPermission } from '../../../utils/common_functions';
import UpdatePassword from './modals/UpdatePassword';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import { useCurrentModule } from '../../../hooks/useCurrentModule';

const ViewEmployee = () => {
  const location = useLocation();
  const { name } = location.state || {};
  const activeTab = useSelector((state) => state?.employeeSlice?.activeTab);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [activityDrawer, setActivityDrawer] = useState(false);
  const { permissions, user_details } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = useCurrentModule();
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const [passwordModal, setPasswordModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const wrapperRef = useRef(null);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      let res = await deleteEmployeeApi(id);
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Employee deleted successfully');
        navigate('/employee');
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleGetEmployeeDetails = async () => {
    try {
      setLoading(true);
      let res = await viewEmployeeApi(id);
      if (res?.statusCode === 200) {
        setDetails(res?.data);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'General Info') {
      handleGetEmployeeDetails();
      wrapperRef.current?.scrollIntoView();
    }
  }, [activeTab]);

  return (
    <div ref={wrapperRef}>
      {passwordModal && (
        <UpdatePassword open={passwordModal} onClose={() => setPasswordModal(false)} />
      )}
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Employee'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this employee?'}
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
          <ActivityEmployee employeeId={id} />
        </Drawer>
      )}
      <FlexWrapper justify="space-between">
        <div>
          <LinkStyled to={'/employee'}>Employees</LinkStyled> / {name}
        </div>
        <FlexWrapper
          gap="6px"
          style={{ cursor: 'pointer' }}
          onClick={() => setActivityDrawer(true)}>
          <HistoryIcon color={colors.darkSkyBlue} />
          <p style={{ color: colors.darkSkyBlue, margin: 0 }}>Activity</p>
        </FlexWrapper>
      </FlexWrapper>
      <FlexWrapper justify="space-between" style={{ marginTop: '20px' }}>
        <Segmented
          prefixCls="antCustomSegmented"
          value={activeTab}
          options={['General Info', 'Documents', 'Salary', 'Remarks']}
          onChange={(value) => {
            dispatch(updateActiveTab(value));
          }}
        />
        <FlexWrapper justify={'end'} gap="10px">
          {canUpdate && (
            <UpdateKeyIconBox
              canUpdate={canUpdate}
              onClick={() => {
                if (canUpdate) {
                  setPasswordModal(true);
                }
              }}>
              <UpdateKeyIcon />
            </UpdateKeyIconBox>
          )}
          {canDelete && (
            <DeleteIconBox
              canDelete={user_details?.id === id ? false : canDelete}
              onClick={() => {
                if (canDelete && user_details?.id !== id) {
                  setDeleteModal(true);
                }
              }}>
              <DeleteIcon />
            </DeleteIconBox>
          )}
        </FlexWrapper>
      </FlexWrapper>
      {activeTab === 'General Info' && (
        <BasicInfo loading={loading} details={details} handleList={handleGetEmployeeDetails} />
      )}
      {activeTab === 'General Info' && (
        <GeneralInfo loading={loading} details={details} handleList={handleGetEmployeeDetails} />
      )}
      {activeTab === 'Documents' && <EmployeeDocuments />}
      {activeTab === 'Salary' && <SalaryInfo />}
      {activeTab === 'Remarks' && <Remarks />}
    </div>
  );
};

export default ViewEmployee;
