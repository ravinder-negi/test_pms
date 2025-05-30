import { Breadcrumb, Button, Drawer, Segmented } from 'antd';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FlexWrapper, NoStyleButton, PurpleText, SkyText } from '../../../theme/common_style';
import { HistoryIcon, HmsHistoryIcon, TrashIconNew } from '../../../theme/SvgIcons';
import HardwareInfo from './components/HardwareInfo';
import AssignedTo from './components/AssignedTo';
import Documents from './components/Documents';
import Remarks from './components/Remarks';
import RetireHardware from './modals/RetireHardware';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import ActivityEmployee from '../ActivityDrawer';
import { updateActivityDrawer } from '../../../redux/sidebar/SidebarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { changeDeviceStatus, deleteDevice, returnDevice } from '../../../services/api_collection';
import { toast } from 'react-toastify';
import HistoryDrawer from '../HistoryDrawer';
import { checkPermission, getFullName } from '../../../utils/common_functions';
import { CheckOutlined, ToolOutlined } from '@ant-design/icons';
import { StickyBox } from '../../../utils/style';
import {
  HmsInternalTabEnum,
  HmsInternalTabOptions,
  hmsStatusEnum,
  hmsTabEnum
} from '../../../utils/constant';

const HmsDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hms, activeTab } = location.state || {};
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false);
  const [retireModal, setRetireModal] = useState(false);
  const [mantainModal, setMaintainModal] = useState(false);
  const [availableModal, setAvailableModal] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [deleteLoder, setDeleteLoader] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'HMS';
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const { id } = useParams();
  const [activeHmsTab, setActiveHmsTab] = useState(
    activeTab === hmsTabEnum?.INVENTORY
      ? HmsInternalTabEnum?.HARDWARE_INFO
      : activeTab === hmsTabEnum?.ASSIGNEE && HmsInternalTabEnum?.ASSIGNED_TO
  );
  const activityDrawer = useSelector((state) => state?.sidebar?.isActivityDrawer);

  const handleDelete = async () => {
    setDeleteLoader(true);
    let res = await deleteDevice(id);
    if (res?.statusCode === 200) {
      setDeleteLoader(false);
      toast.success(res?.message);
      setDeleteModal(false);
      navigate(-1);
    } else {
      setDeleteLoader(false);
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Somehing went wrong'
      );
    }
  };

  const handleChangeStatus = async (value) => {
    let req = {
      deviceId: id,
      status: value
    };
    let res = await changeDeviceStatus(req);
    if (res?.statusCode === 200) {
      toast.success(res?.message);
      navigate('/hms');
      onClose();
    } else {
      toast.error(
        res?.response?.data?.message || res?.error || res.message || 'Something went wrong'
      );
    }
  };

  const handleStatus = () => {
    if (hms?.status === hmsStatusEnum?.ASSIGNED) {
      handleChangeStatus('Maintainance');
    } else if (hms?.status == hmsStatusEnum?.MAINTENANCE) {
      handleChangeStatus('Available');
    }
  };

  const handleReturnDevice = async () => {
    setReturnLoading(true);
    let res = await returnDevice(hms?.device?.id, hms?.employee?.id);
    if (res?.statusCode === 200) {
      toast.success(res?.message);
      setReturnModal(false);
      setReturnLoading(false);
      navigate(-1);
    } else {
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
      setReturnLoading(false);
    }
  };

  return (
    <div>
      {activityDrawer && (
        <Drawer
          width={490}
          title="Activity"
          placement="right"
          closable={true}
          prefixCls="activityCustomDrawer"
          onClose={() => dispatch(updateActivityDrawer(false))}
          open={activityDrawer}
          key="right">
          <ActivityEmployee id={id} />
        </Drawer>
      )}
      {mantainModal && (
        <ConfirmationModal
          open={mantainModal}
          onCancel={() => setMaintainModal(false)}
          title={'Mark for Maintainance'}
          onSubmit={handleStatus}
          buttonName={'Mark Maintainance'}
          description={'Are you sure you want to update status to maintenance?'}
          iconBG={'#FB4A49'}
          icon={
            <ToolOutlined
              style={{ fontSize: '24px', width: '24px', height: '24px', color: 'white' }}
            />
          }
        />
      )}
      {availableModal && (
        <ConfirmationModal
          open={availableModal}
          onCancel={() => setAvailableModal(false)}
          title={'Mark for Availability'}
          onSubmit={handleStatus}
          buttonName={'Mark Available'}
          description={'Are you sure you want to update status to Available?'}
          iconBG={'#7C71FF'}
          icon={
            <CheckOutlined
              style={{ fontSize: '24px', width: '24px', height: '24px', color: 'white' }}
            />
          }
        />
      )}
      {openHistoryDrawer && (
        <Drawer
          width={490}
          title="History"
          placement="right"
          closable={true}
          prefixCls="activityCustomDrawer"
          onClose={() => setOpenHistoryDrawer(false)}
          open={openHistoryDrawer}
          key="right">
          <HistoryDrawer id={id} />
        </Drawer>
      )}
      {retireModal && <RetireHardware open={retireModal} onClose={() => setRetireModal(false)} />}
      {returnModal && (
        <ConfirmationModal
          open={returnModal}
          onCancel={() => setReturnModal(false)}
          title={'Return Device'}
          description={
            'Are you sure you want to return this item to inventory? It will become available for reassignment.'
          }
          onSubmit={handleReturnDevice}
          iconBG={'#7C71FF'}
          loading={returnLoading}
        />
      )}
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Device'}
          description={'Are you sure you want to delete this Device?'}
          onSubmit={handleDelete}
          icon={<TrashIconNew />}
          iconBG={'red'}
          loading={deleteLoder}
        />
      )}
      <StickyBox padding="16px 0">
        <FlexWrapper justify="space-between" gap="10px">
          <Breadcrumb
            items={[
              { title: <Link to="/hms">HMS</Link> },
              {
                title:
                  activeTab === hmsTabEnum?.INVENTORY
                    ? hms?.device_id
                    : activeTab === hmsTabEnum?.ASSIGNEE &&
                      getFullName(
                        hms?.employee?.first_name,
                        hms?.employee?.middle_name,
                        hms?.employee?.last_name
                      )
              }
            ]}
          />

          <FlexWrapper gap="16px">
            {activeTab === hmsTabEnum?.INVENTORY && (
              <>
                <NoStyleButton
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onClick={() => setOpenHistoryDrawer(true)}>
                  <HmsHistoryIcon />
                  <SkyText size="17px">History</SkyText>
                </NoStyleButton>
                <div style={{ height: '26px', borderLeft: '1px solid #D9D9D9' }} />
              </>
            )}
            {activeTab !== hmsTabEnum?.ASSIGNEE && (
              <NoStyleButton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onClick={() => {
                  dispatch(updateActivityDrawer(true));
                }}>
                <HistoryIcon />
                <PurpleText size="17px">Activity</PurpleText>
              </NoStyleButton>
            )}
            {activeTab === hmsTabEnum?.ASSIGNEE && canUpdate && (
              <Button prefixCls="transparentBtn" onClick={() => setReturnModal(true)}>
                Return Device
              </Button>
            )}
          </FlexWrapper>
        </FlexWrapper>
      </StickyBox>
      {activeTab !== hmsTabEnum?.ASSIGNEE && (
        <StickyBox padding="0">
          <FlexWrapper
            gap="10px"
            justify-content="flex-end"
            style={{
              justifyContent: activeTab === hmsTabEnum?.INVENTORY ? 'space-between' : 'end'
            }}
            margin="10px 0px">
            {activeTab === hmsTabEnum?.INVENTORY && (
              <Segmented
                style={{ margin: '12px 0' }}
                prefixCls="antCustomSegmented"
                value={activeHmsTab}
                options={HmsInternalTabOptions}
                onChange={(value) => setActiveHmsTab(value)}
              />
            )}
            <FlexWrapper gap="10px">
              {activeTab === hmsTabEnum?.INVENTORY &&
                hms?.status !== hmsStatusEnum?.RETIRED &&
                canUpdate && (
                  <>
                    {/* {hms?.status !== 'available' && (
                    <CustomBtn
                      status={hms?.device_status}
                      onClick={() => {
                        if (hms?.status === hmsStatusEnum?.ASSIGNED) {
                          setMaintainModal(true);
                        } else if (hms?.status == hmsStatusEnum?.MAINTENANCE) {
                          setAvailableModal(true);
                        }
                      }}>
                      {hms?.status === hmsStatusEnum?.ASSIGNED
                        ? 'Mark Maintainance'
                        : hms?.status === hmsStatusEnum?.MAINTENANCE && 'Mark Available'}
                    </CustomBtn>
                  )} */}
                    <Button prefixCls="transparentRedBtn" onClick={() => setRetireModal(true)}>
                      Retire
                    </Button>
                  </>
                )}
            </FlexWrapper>
          </FlexWrapper>
        </StickyBox>
      )}

      {activeHmsTab === HmsInternalTabEnum?.HARDWARE_INFO &&
        activeTab === hmsTabEnum?.INVENTORY && <HardwareInfo data={hms} />}
      {activeHmsTab === HmsInternalTabEnum?.ASSIGNED_TO && (
        <AssignedTo data={hms} setActiveHmsTab={setActiveHmsTab} />
      )}
      {activeHmsTab === HmsInternalTabEnum?.REMARKS && <Remarks />}
      {activeHmsTab === HmsInternalTabEnum?.DOCUMENTS && <Documents />}
    </div>
  );
};

export default HmsDetails;
