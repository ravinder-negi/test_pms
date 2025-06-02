import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import {
  ClickWrapper,
  FlexWrapper,
  GridBox,
  InfoWrapper,
  PurpleText
} from '../../../../theme/common_style';
import { ContentWrapper } from '../../common';
import PropTypes from 'prop-types';
import DetailsBox from './DetailsBox';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getDeviceAssignDetails } from '../../../../services/api_collection';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import useDepartmentOptions from '../../../../hooks/useDepartmentOptions';
import useDesignationOptions from '../../../../hooks/useDesignationOptions';
import EmptyData from '../../../../components/common/EmptyData';
import { NoMilestone } from '../../../../theme/SvgIcons';
import AvatarImage from '../../../../components/common/AvatarImage';
import { getFullName } from '../../../../utils/common_functions';
import { Skeleton } from 'antd';
import { HmsInternalTabEnum, hmsTabEnum } from '../../../../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { updateHmsTab, updateInternalHmsTab } from '../../../../redux/hms/HmsSlice';
// import { updateHmsTab } from '../../../../redux/hms/HmsSlice';

const AssignedTo = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state?.HmsSlice?.HmsTab);
  const { hms } = location.state || {};
  const { id } = useParams();
  const { options: departmentOptions } = useDepartmentOptions();
  const [assignToDetails, setAssignToDetails] = useState(null);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const matchDepartment = departmentOptions?.find(
    (val) => val?.value == assignToDetails?.device?.[0]?.employee?.department
  );

  const getFormattedDate = (ts) => {
    const timestamp = Number(ts);
    if (!timestamp || isNaN(timestamp)) return '-';
    const isInSeconds = timestamp.toString().length === 10;
    return dayjs(isInSeconds ? timestamp * 1000 : timestamp).format('DD MMM YYYY');
  };

  const fetchDesignation = async () => {
    if (matchDepartment) {
      const res = await useDesignationOptions(matchDepartment?.value);
      let obj = res.find(
        (item) => item?.id === assignToDetails?.device?.[0]?.employee?.designation
      );
      setDesignationOptions(obj);
    }
  };
  const fromattedData = [
    { key: 'Employee Name', value: assignToDetails?.device?.[0]?.employee?.first_name || 'N/A' },
    { key: 'Employee Id', value: assignToDetails?.device?.[0]?.employee?.emp_code || 'N/A' },
    { key: 'Designation', value: designationOptions?.designation || 'N/A' },
    { key: 'Role', value: assignToDetails?.device?.[0]?.employee?.role_id?.role || 'N/A' },
    { key: 'Department', value: matchDepartment?.label || 'N/A' },
    {
      key: 'Date Assigned',
      value: getFormattedDate(assignToDetails?.device?.[0]?.assign_date)
    }
  ];

  const hardwareData = [
    { key: 'Device Id', value: assignToDetails?.device_id },
    { key: 'Device Type', value: assignToDetails?.device_type },
    { key: 'Brand', value: assignToDetails?.brand },
    { key: 'Model', value: assignToDetails?.model },
    { key: 'Serial Number', value: assignToDetails?.serial_number }
  ];

  const specifications = [
    { key: 'CPU', value: assignToDetails?.cpu || 'N/A' },
    { key: 'RAM', value: assignToDetails?.ram || 'N/A' },
    { key: 'Storage', value: assignToDetails?.storage || 'N/A' },
    { key: 'Graphics', value: assignToDetails?.graphics || 'N/A' },
    { key: 'Oprating System', value: assignToDetails?.operating_system || 'N/A' },
    { key: 'MAC Address', value: assignToDetails?.macORip_address || 'N/A' },
    { key: 'Username', value: assignToDetails?.user_name || 'N/A' },
    { key: 'Password', value: assignToDetails?.password || 'N/A' }
  ];

  const handleGetDeviceDetails = async () => {
    setLoading(true);
    if (id && (activeTab == hmsTabEnum?.INVENTORY || activeTab == hmsTabEnum?.ASSIGNEE)) {
      let res = await getDeviceAssignDetails(
        activeTab == hmsTabEnum?.INVENTORY ? id : hms?.device?.id
      );
      if (res?.statusCode === 200) {
        setAssignToDetails(res?.data);
        setLoading(false);
      } else {
        setAssignToDetails(null);
        toast.error(
          res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
        );
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    handleGetDeviceDetails();
  }, [activeTab]);

  useEffect(() => {
    fetchDesignation();
  }, [matchDepartment?.value]);

  return assignToDetails || loading ? (
    <div>
      <Title level={4} style={{ margin: '10px 0', textAlign: 'left' }}>
        Assigned To
      </Title>
      <FlexWrapper wrap="nowrap" gap="10px" align="unset">
        <ContentWrapper padding="32px 40px" style={{ width: 'fit-content' }}>
          {loading ? (
            <Skeleton.Avatar active size={180} shape="circle" />
          ) : (
            <AvatarImage
              style={{ width: '180px', height: '180px' }}
              image={
                process.env.REACT_APP_S3_BASE_URL +
                'employee/profileImg/' +
                assignToDetails?.device?.[0]?.employee?.id +
                '.jpg'
              }
              name={getFullName(
                assignToDetails?.device?.[0]?.employee?.first_name,
                assignToDetails?.device?.[0]?.middle_name,
                assignToDetails?.device?.[0]?.employee?.last_name
              )}
            />
          )}
        </ContentWrapper>
        <ContentWrapper style={{ width: '100%' }}>
          <FlexWrapper align="start" wrap="nowrap" gap="10px" justify="start">
            <GridBox cols={2} style={{ width: '80%', textTransform: 'capitalize' }}>
              {fromattedData?.map((item, i) => (
                <InfoWrapper key={i}>
                  <span>{item?.key}</span>
                  {loading ? (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 80, height: 16, margin: 0 }}
                    />
                  ) : (
                    <p>{item?.value}</p>
                  )}
                </InfoWrapper>
              ))}
            </GridBox>
            {loading ? (
              <Skeleton.Input active size="small" style={{ width: 150, height: 20, margin: 0 }} />
            ) : (
              <ClickWrapper
                onClick={() =>
                  navigate(`/view-employee/${assignToDetails?.device?.[0]?.employee?.id}`)
                }>
                <PurpleText style={{ width: '20%', textAlign: 'right', cursor: 'pointer' }}>
                  View Employee details
                </PurpleText>
              </ClickWrapper>
            )}
          </FlexWrapper>
        </ContentWrapper>
      </FlexWrapper>
      {activeTab === hmsTabEnum?.ASSIGNEE && (
        <div>
          <FlexWrapper justify="space-between" gap="10px" margin="20px 0 0">
            <Title level={4} style={{ margin: 0 }}>
              Hardware Info
            </Title>
            <ClickWrapper
              onClick={() => {
                dispatch(updateHmsTab(hmsTabEnum?.INVENTORY));
                dispatch(updateInternalHmsTab(HmsInternalTabEnum?.HARDWARE_INFO));
                navigate(`/hms/details/${data?.device?.id}`, {
                  state: { hms: data?.device }
                });
              }}>
              <PurpleText style={{ cursor: 'pointer' }}>View Full Details</PurpleText>
            </ClickWrapper>
          </FlexWrapper>
          <ContentWrapper style={{ margin: '10px 0 12px' }}>
            <GridBox cols={5}>
              {hardwareData?.map((item, i) => (
                <InfoWrapper key={i}>
                  <span>{item?.key}</span>
                  {loading ? (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 80, height: 16, margin: 0 }}
                    />
                  ) : (
                    <p>{item?.value}</p>
                  )}
                </InfoWrapper>
              ))}
            </GridBox>
          </ContentWrapper>
          <DetailsBox loading={loading} heading={'Specifications'} cols={3} data={specifications} />
        </div>
      )}
    </div>
  ) : (
    <EmptyData
      height={'50vh'}
      icon={<NoMilestone />}
      title={'No Assignee'}
      subTitle={'This device is not assigned to anyone yet.'}
    />
  );
};

AssignedTo.propTypes = {
  data: PropTypes.object
};

export default AssignedTo;
