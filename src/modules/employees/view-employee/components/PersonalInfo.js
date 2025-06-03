/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { PersonalInfoStyle, ProfileBox } from '../ViewEmployeeStyle';
import { FlexWrapper, GridBox } from '../../../../theme/common_style';
import { EditIcon } from '../../../../theme/SvgIcons';
import JobInfo from '../modals/JobInfo';
import { Skeleton } from 'antd';
import { checkPermission } from '../../../../utils/common_functions';
import moment from 'moment';
import { useSelector } from 'react-redux';
import useDepartmentOptions from '../../../../hooks/useDepartmentOptions';
import useDesignationOptions from '../../../../hooks/useDesignationOptions';
import { useCurrentModule } from '../../../../hooks/useCurrentModule';

const PersonalInfo = ({ loading, details, handleList }) => {
  const [jobInfoModal, setJobInfoModal] = useState(false);
  const { options: departmentOptions } = useDepartmentOptions();
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = useCurrentModule();
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
