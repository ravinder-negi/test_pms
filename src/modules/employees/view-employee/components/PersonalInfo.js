/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { PersonalInfoStyle, ProfileBox } from '../ViewEmployeeStyle';
import { FlexWrapper, GridBox } from '../../../../theme/common_style';
import { EditIcon } from '../../../../theme/SvgIcons';
import JobInfo from '../modals/JobInfo';
import { Skeleton } from 'antd';
import { checkPermission, currentModule } from '../../../../utils/common_functions';
import moment from 'moment';
import { useSelector } from 'react-redux';
import useDepartmentOptions from '../../../../hooks/useDepartmentOptions';
import useDesignationOptions from '../../../../hooks/useDesignationOptions';

const PersonalInfo = ({ loading, details, handleList }) => {
  const [jobInfoModal, setJobInfoModal] = useState(false);
  const { options: departmentOptions } = useDepartmentOptions();
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = currentModule();
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const [designationOptions, setDesignationOptions] = useState([]);
  const matchDepartment = departmentOptions?.find((val) => val?.label == details?.department);

  const fetchDesignation = async () => {
    if (matchDepartment) {
      const res = await useDesignationOptions(matchDepartment?.value);
      let obj = res.find((item) => item?.designation === details?.designation);
      setDesignationOptions(obj);
    }
  };

  useEffect(() => {
    fetchDesignation();
  }, [matchDepartment?.value]);

  return (
    <>
      {jobInfoModal && (
        <JobInfo
          open={jobInfoModal}
          onClose={() => setJobInfoModal(false)}
          editDetails={details}
          handleList={handleList}
          matchDepartment={matchDepartment}
          matchedDesignations={designationOptions}
        />
      )}
      {/* <ProfileBox>
        {!loading ? (
          <PersonalInfoStyle>
            <div className="title">
              <h5>Personal Info</h5>
              {canUpdate && (
                <div className="edit-profile" onClick={() => setCreateModal(true)}>
                  <EditIcon />
                </div>
              )}
            </div>

            <div className="details">
              <div className="names">
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>Name</p>
                  <p className="values" style={{ textTransform: 'unset' }}>
                    {getFullName(details?.first_name, details?.middle_name, details?.last_name) ||
                      'N/A'}
                  </p>
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>Gender</p>
                  <p className="values">{details?.gender || 'N/A'}</p>
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>D.O.B.</p>
                  <p className="values">
                    {details?.date_of_birth
                      ? moment(details?.date_of_birth).format('DD/MM/YYYY')
                      : 'N/A'}
                  </p>
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>Blood Group</p>
                  <p className="values">{details?.blood_group || 'N/A'}</p>
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>Marital Status</p>
                  <p className="values">{details?.martial_status || 'N/A'}</p>
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>Contact Number</p>
                  <p className="values">{details?.contact_number || 'N/A'}</p>
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'36px'}>
                  <p>Emergancy Contact No.</p>
                  <p className="values">{details?.emergency_contact_number || 'N/A'}</p>
                </FlexWrapper>
              </div>
              <div className="line" />
              <div className="names contacts">
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>Whatsapp No.</p>
                  <p className="values">{details?.whatsapp_number || 'N/A'}</p>
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>Personal Email</p>
                  <p className="values" style={{ textTransform: 'unset' }}>
                    {details?.personal_email || 'N/A'}
                  </p>
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>UDID</p>
                  <p className="values">{details?.udid || 'N/A'}</p>
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>PAN No.</p>
                  <p className="values">{details?.pan_no || 'N/A'}</p>
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>Current Address </p>
                  {details?.currentAddress?.address_line_one ? (
                    <p className="values tooltip">
                      {details?.currentAddress?.address_line_one},{' '}
                      {details?.currentAddress?.address_line_two}, {details?.currentAddress?.city},{' '}
                      {details?.currentAddress?.state},{details?.currentAddress?.country}
                    </p>
                  ) : (
                    <p className="values">N/A</p>
                  )}
                </FlexWrapper>
                <FlexWrapper justify={'start'} gap={'50px'}>
                  <p>Permanent Address </p>
                  {details?.permanentAddress?.address_line_one ? (
                    <p className="values tooltip">
                      {details?.permanentAddress?.address_line_one},{' '}
                      {details?.permanentAddress?.address_line_two},{' '}
                      {details?.permanentAddress?.city}, {details?.permanentAddress?.state},
                      {details?.permanentAddress?.country}
                    </p>
                  ) : (
                    <p className="values">N/A</p>
                  )}
                </FlexWrapper>
              </div>
            </div>
          </PersonalInfoStyle>
        ) : (
          <Skeleton active paragraph={{ rows: 6 }} title={false} />
        )}
      </ProfileBox> */}
      <ProfileBox>
        {!loading ? (
          <PersonalInfoStyle>
            <div className="title">
              <h5>Job Info</h5>
              {canUpdate && (
                <div className="edit-profile" onClick={() => setJobInfoModal(true)}>
                  <EditIcon />
                </div>
              )}
            </div>
            <GridBox cols={4} style={{ marginTop: '6px' }}>
              <div className="job-details">
                <p>Employee Code</p>
                <h5>{details?.emp_code || 'N/A'}</h5>
              </div>
              <div className="job-details">
                <p>Date of Joining</p>
                <h5>
                  {details?.date_of_joining
                    ? moment(details?.date_of_joining).format('DD/MM/YYYY')
                    : 'N/A'}
                </h5>
              </div>
              {/* <div className="job-details">
                <p>Job Status</p>
                <h5>
                  {jobStatusOption.find((el) => el?.id === details?.job_status)
                    ?.name || 'N/A'}
                </h5>
              </div> */}
              <div className="job-details">
                <p>Designation</p>
                <h5>{designationOptions?.designation || 'N/A'}</h5>
              </div>
              <div className="job-details">
                <p>Department</p>
                <h5>{matchDepartment?.label || 'N/A'}</h5>
              </div>
            </GridBox>
            <GridBox cols={4} style={{ marginTop: '6px' }}>
              <div className="job-details" style={{ gridColumn: 'span 3' }}>
                <p>Technology</p>
                <FlexWrapper justify={'start'} gap={'10px'} wrap={'wrap'}>
                  {details?.technologies?.length > 0
                    ? details?.technologies?.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            width: 'fit-content',
                            minWidth: '63px',
                            borderRadius: '100px',
                            padding: '6px 8px',
                            backgroundColor: '#F6F6F6',
                            fontWeight: 500,
                            fontFamily: 'Plus Jakarta Sans',
                            textAlign: 'center'
                          }}>
                          {item || 'N/A'}
                        </div>
                      ))
                    : 'N/A'}
                </FlexWrapper>
              </div>
              {details?.date_of_leaving && (
                <div className="job-details">
                  <p>Relieving Date</p>
                  <h5>{moment(details?.date_of_leaving).format('DD/MM/YYYY')}</h5>
                </div>
              )}
            </GridBox>
          </PersonalInfoStyle>
        ) : (
          <Skeleton active paragraph={{ rows: 2 }} title={false} />
        )}
      </ProfileBox>
    </>
  );
};

export default PersonalInfo;
