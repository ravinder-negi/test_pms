import React, { useEffect, useState } from 'react';
import { ApplyDate, FlexWrapper, Title } from '../../theme/common_style';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, Skeleton } from 'antd';
import { Button, Table } from 'antd';
import '../../theme/antCustomComponents.css';
import styled from '@emotion/styled';
import { LmsNextIcon } from '../../theme/SvgIcons';
import { GetLeaveApi, UpdateLeaveStatusApi } from '../../redux/lms/apiRoute';
import { toast } from 'react-toastify';
import { getCategory, getFullName, getSlot, getStatusTag } from '../../utils/common_functions';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import DeclineLeaveModal from '../../components/Modal/DeclineLeaveModal';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import AvatarImage from '../../components/common/AvatarImage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { StickyBox } from '../../utils/style';

const Container = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  margin: 0 auto;
  width: 100%;
  font-family: 'Plus Jakarta Sans';
`;

const Header = styled.div`
  font-family: 'Plus Jakarta Sans';
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Label = styled.div`
  font-family: 'Plus Jakarta Sans';
  font-size: 14px;
  font-weight: 500;
`;

const Footer = styled.div`
  font-family: 'Plus Jakarta Sans';
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const RequestDetails = () => {
  const location = useLocation();
  const [approveLoading, setApproveLoading] = useState(false);
  const [lms, setLms] = useState();
  const [reporting, setReporting] = useState();
  const [loading, setLoading] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const id = location.pathname?.split('/')[location.pathname?.split('/').length - 1];

  const columns = [
    { title: 'Emp ID', dataIndex: 'emp_id', key: 'emp_id' },
    { title: 'Leave type', dataIndex: 'leave_type', key: 'leave_type' },
    { title: 'Start Date', dataIndex: 'start_date', key: 'start_date' },
    { title: 'End Date', dataIndex: 'end_date', key: 'end_date' },
    {
      title: 'Leave Category',
      dataIndex: 'leave_category',
      key: 'leave_category',
      render: (leave_category) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
            <span style={{ whiteSpace: 'nowrap' }}>{getCategory(leave_category) ?? 'N/A'}</span>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Leave Slot',
      dataIndex: 'leave_slot',
      key: 'leave_slot',
      render: (leave_slot) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
            <span style={{ whiteSpace: 'nowrap' }}>{getSlot(leave_slot) ?? 'N/A'}</span>
          </FlexWrapper>
        );
      }
    },
    { title: 'No of Leaves', dataIndex: 'no_of_leaves', key: 'no_of_leaves' }
  ];

  const updateLeaveStatus = async (status) => {
    setApproveLoading(true);
    try {
      const res = await UpdateLeaveStatusApi({
        ['leave_id']: Number(id),
        ['leave_status']: status
      });
      if (res.statusCode === 200) {
        toast.success(res?.message);
        getDetails();
      } else {
        toast.warning(res?.message);
      }
    } catch (errorInfo) {
      if (errorInfo.errorFields.length > 0) {
        form.scrollToField(errorInfo.errorFields[0].name);
      }
    } finally {
      setApproveLoading(false);
      setApproveModal(false);
    }
  };

  const getDetails = async () => {
    setLoading(true);
    try {
      const res = await GetLeaveApi({
        ['leave_id']: Number(id)
      });
      if (res.statusCode === 200) {
        setLms({
          ...res?.data?.leave,
          ['emp_id']: res?.data?.leave?.employee?.id
        });
        setReporting(res?.data?.reportingDetails?.employee);
      } else {
        toast.warning(res?.message);
      }
    } catch (errorInfo) {
      if (errorInfo.errorFields.length > 0) {
        form.scrollToField(errorInfo.errorFields[0].name);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {approveModal && (
        <ConfirmationModal
          open={approveModal}
          onCancel={() => setApproveModal(false)}
          title={'Approve Leave'}
          onSubmit={() => updateLeaveStatus('Approved')}
          buttonName={'Approve'}
          description={'Are you sure you want to approve this Leave?'}
          iconBG={'#7C71FF'}
          icon={
            <CheckOutlined
              style={{ fontSize: '24px', width: '24px', height: '24px', color: 'white' }}
            />
          }
          loading={approveLoading}
        />
      )}
      {declineModal && (
        <DeclineLeaveModal
          open={declineModal}
          onCancel={() => setDeclineModal(false)}
          title={'Decline Leave'}
          id={Number(id)}
          getDetails={getDetails}
          onSubmit={() => updateLeaveStatus('Cancelled')}
          buttonName={'Decline'}
          description={'Are you sure you want to decline this Leave?'}
          iconBG={'#FB4A49'}
          icon={
            <CloseOutlined
              style={{ fontSize: '24px', width: '24px', height: '24px', color: 'white' }}
            />
          }
        />
      )}
      <StickyBox>
        <FlexWrapper justify="space-between">
          <Breadcrumb
            items={[
              { title: <Link to="/requests">Leave Request</Link> },
              { title: lms?.employee?.first_name }
            ]}
          />
        </FlexWrapper>
      </StickyBox>
      {!loading ? (
        <Container>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <Header>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Title>{lms?.leave_type}</Title>
                <ApplyDate>
                  <span style={{ fontWeight: '700' }}>Apply Date: </span>
                  {lms?.created_at?.split('T')?.[0]}
                </ApplyDate>
              </div>
              <div>{getStatusTag(lms?.leave_status)}</div>
            </Header>

            <FlexWrapper justify="flex-start" gap="16px" cursor="default">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                <Label>Submitter</Label>
                <FlexWrapper
                  gap="10px"
                  align="center"
                  justify="space-between"
                  cursor="default"
                  style={{
                    borderRadius: '100px',
                    padding: '6px 10px',
                    backgroundColor: '#F3F6FC'
                  }}>
                  <AvatarImage
                    style={{
                      height: '32px',
                      width: '32px',
                      minWidth: '32px',
                      fontSize: '16px'
                    }}
                    image={`${
                      process.env.REACT_APP_S3_BASE_URL +
                      'employee/profileImg/' +
                      lms?.employee?.id +
                      '.jpg'
                    }`}
                    name={getFullName(
                      lms?.employee?.first_name,
                      lms?.employee?.middle_name,
                      lms?.employee?.last_name
                    )}
                  />
                  <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600' }}>
                      {lms?.employee?.first_name + ' ' + lms?.employee?.last_name}
                    </div>
                    <div
                      style={{
                        color: '#999',
                        fontSize: '10px',
                        fontWeight: '400',
                        textTransform: 'capitalize'
                      }}>
                      {lms?.employee?.role_id?.role}
                    </div>
                  </div>
                </FlexWrapper>
              </div>
              <div style={{ marginTop: '30px' }}>
                <LmsNextIcon />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                <Label>Approve by</Label>
                <FlexWrapper gap="10px" alignItems="center" cursor="default">
                  <FlexWrapper
                    gap="10px"
                    align="center"
                    cursor="default"
                    justify="space-between"
                    style={{
                      borderRadius: '100px',
                      padding: '6px 10px',
                      backgroundColor: '#F3F6FC'
                    }}>
                    <AvatarImage
                      style={{
                        height: '32px',
                        width: '32px',
                        minWidth: '32px',
                        fontSize: '16px'
                      }}
                      image={`${
                        process.env.REACT_APP_S3_BASE_URL +
                        'employee/profileImg/' +
                        reporting?.id +
                        '.jpg'
                      }`}
                      name={getFullName(
                        reporting?.first_name,
                        reporting?.middle_name,
                        reporting?.last_name
                      )}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}>
                      <div style={{ fontSize: '12px', fontWeight: '600' }}>
                        {reporting?.first_name + ' ' + reporting?.last_name}
                      </div>
                      <div
                        style={{
                          color: '#999',
                          fontSize: '10px',
                          fontWeight: '400',
                          textTransform: 'capitalize'
                        }}>
                        {reporting?.role_id?.role}
                      </div>
                    </div>
                  </FlexWrapper>
                </FlexWrapper>
              </div>
            </FlexWrapper>

            <FlexWrapper align="flex-start" direction="column" gap="10px" cursor="default">
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'default'
                }}>
                Leave Info
              </div>
              {lms && (
                <Table
                  prefixCls="antCustomTable"
                  columns={columns}
                  dataSource={[lms]}
                  pagination={false}
                  style={{
                    width: '100%',
                    border: '1px solid #C8C8C8',
                    borderRadius: '12px',
                    cursor: 'default'
                  }}
                />
              )}
            </FlexWrapper>

            <FlexWrapper align="flex-start" direction="column" gap="10px" cursor="default">
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'default'
                }}>
                Leave Reason
              </div>
              <ReactQuill
                value={lms?.reason}
                readOnly
                className="custom-quill"
                modules={{ toolbar: false }}
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  width: '100%'
                }}
              />
            </FlexWrapper>
          </div>
        </Container>
      ) : (
        <Container>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <Header>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Skeleton.Input style={{ width: 120 }} active size="small" />
                <Skeleton.Input style={{ width: 100, marginTop: 8 }} active size="small" />
              </div>
              <Skeleton.Button style={{ width: 80 }} active size="small" />
            </Header>

            <FlexWrapper justify="flex-start" gap="16px" cursor="default">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                <Skeleton.Input style={{ width: 80 }} active size="small" />
                <FlexWrapper
                  gap="10px"
                  align="center"
                  justify="space-between"
                  cursor="default"
                  style={{
                    borderRadius: '100px',
                    padding: '6px 10px',
                    backgroundColor: '#F3F6FC'
                  }}>
                  <Skeleton.Avatar size={32} shape="circle" active />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Skeleton.Input active size="small" />
                  </div>
                </FlexWrapper>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                <Skeleton.Input style={{ width: 80 }} active size="small" />
                <FlexWrapper
                  gap="10px"
                  align="center"
                  justify="space-between"
                  cursor="default"
                  style={{
                    borderRadius: '100px',
                    padding: '6px 10px',
                    backgroundColor: '#F3F6FC'
                  }}>
                  <Skeleton.Avatar size={32} shape="circle" active />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Skeleton.Input active size="small" />
                  </div>
                </FlexWrapper>
              </div>
            </FlexWrapper>

            {/* Leave Info Skeleton */}
            <FlexWrapper align="flex-start" direction="column" gap="10px" cursor="default">
              <Skeleton.Input active size="small" />
              <Skeleton active paragraph={{ rows: 3 }} title={false} />
            </FlexWrapper>

            <Skeleton active paragraph={{ rows: 3 }} title={false} />
          </div>
        </Container>
      )}
      {!loading && (
        <Footer style={{ marginTop: '24px' }}>
          <Button
            onClick={() => {
              setApproveModal(true);
            }}
            type="text"
            style={{
              width: '107px',
              height: '44px',
              padding: '10px 20px',
              borderRadius: '10px',
              color: 'white',
              backgroundColor: '#2BC106',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Plus Jakarta Sans'
            }}>
            Approve
          </Button>
          <Button
            onClick={() => {
              setDeclineModal(true);
            }}
            type="text"
            style={{
              width: '107px',
              height: '44px',
              padding: '10px 20px',
              borderRadius: '10px',
              color: 'white',
              backgroundColor: '#D82D2D',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Plus Jakarta Sans'
            }}>
            Decline
          </Button>
        </Footer>
      )}
    </div>
  );
};

export default RequestDetails;
