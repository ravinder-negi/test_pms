/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { DarkText, FlexWrapper, fontFamilys, GreyText, PurpleText } from '../../theme/common_style';
import Title from 'antd/es/typography/Title';
import TextArea from 'antd/es/input/TextArea';
import { Skeleton } from 'antd';
import styled from '@emotion/styled/macro';
import PropTypes from 'prop-types';
import AddMemeberModal from './AddMemeberModal';
import { useSelector } from 'react-redux';
import { getProjectDetails } from '../../redux/project/apiRoute';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { getStatusTag } from '../../modules/projects/Projects';
import { AmountInPattern, checkPermission, getFullName } from '../../utils/common_functions';
import { AvatarGroupRow } from '../common/AvatarGroup';
import {
  projectBillingType,
  projectCondition,
  projectPhase,
  ProjectSource
} from '../../utils/constant';
import useTechnologyOptions from '../../hooks/useTechnologyOptions';
import UserInfoModal from '../common/UserInfoModal';

const GeneralInfo = ({ setEditData, editData, updated }) => {
  const { isEmployee } = useSelector((e) => e.userInfo);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [details, setDetails] = useState([]);
  const [billingDetails, setBillingDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'Projects';
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const image_end = 'employee/profileImg/';
  const { options: technologyOptions } = useTechnologyOptions();
  const [infoModal, setInfoModal] = useState(false);

  const handleGetDetails = async () => {
    try {
      setLoading(true);
      const res = await getProjectDetails(id);
      if (res?.statusCode === 200) {
        setData(res?.data);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // const incharges = [logo, profileLogo];
  const project_incharge_members = editData?.project_Assignee
    .filter((assignee) => assignee.role === 'Project Incharge')
    .map((assignee) => assignee);

  const employee_members = editData?.project_Assignee
    .filter((assignee) => assignee.role === 'Developer')
    .map((assignee) => assignee);

  const project_manager_members = editData?.project_Assignee?.find(
    (assignee) => assignee.role === 'Project Manager'
  );

  useEffect(() => {
    handleGetDetails();
  }, [updated]);

  useEffect(() => {
    if (data) {
      const pType = projectBillingType.find((type) => type.value === data?.project_type)?.label;
      const pCondition = projectCondition.find(
        (type) => type.value === data?.project_condition
      )?.label;
      const pPhase = projectPhase.find((type) => type.value === data?.project_phase)?.label;
      const pPlateform = technologyOptions
        .filter((item) => data?.project_platform?.includes(item.value))
        .map((item) => item.label);
      const newDetails = [
        { key: 'Client Name', value: data?.client?.name || 'N/A' },
        { key: 'Project Type', value: pType || 'N/A' },
        { key: 'Project Condition', value: pCondition || 'N/A' },
        { key: 'Project Phase', value: pPhase || 'N/A' },
        { key: 'Platform', value: pPlateform || 'N/A' },
        {
          key: 'Deadline',
          value: moment(data.deadline).format('DD MMM YYYY') || 'N/A'
        }
      ];

      if (!isEmployee) {
        const pSource = ProjectSource.find((type) => type.value === data?.sourced_from)?.label;
        const pHiredid = data?.hired?.map((val) => val?.name);
        const billingInfo = [
          { key: 'Sourced From', value: pSource || 'N/A' },
          { key: 'Hired IDs', value: pHiredid },
          { key: 'No. of Hours', value: `${data?.no_of_hours || '0'} hrs` },
          {
            key: 'Project Budget',
            value: `$${AmountInPattern(data?.budget || 0)}`
          }
        ];
        setBillingDetails(billingInfo);
      }
      setEditData(data);
      setDetails(newDetails);
    }
  }, [data]);

  return (
    <>
      {infoModal && (
        <UserInfoModal
          visible={infoModal ? true : false}
          onClose={() => setInfoModal(false)}
          user={infoModal}
        />
      )}
      {loading ? (
        <ContentWrapper>
          <Skeleton active title={false} paragraph={{ rows: 15 }} />
        </ContentWrapper>
      ) : (
        <ContentWrapper>
          <FlexWrapper justify="space-between" margin="0 0 16px">
            <FlexWrapper direction="column" align="start" gap="4px">
              <Title level={4} style={{ margin: 0 }}>
                {data?.name || 'N/A'}
              </Title>
              <PurpleText>
                <span style={{ fontWeight: 600 }}>Start Date: </span>
                {data?.start_date ? moment(data?.start_date).format('DD MMM YYYY') : 'N/A'}
              </PurpleText>
            </FlexWrapper>
            {getStatusTag(data?.status)}
          </FlexWrapper>
          <Grid>
            {details.map((item, index) => (
              <FlexWrapper key={index} direction="column" justify="start" align="start" gap="3px">
                <GreyText>{item?.key}</GreyText>
                {item?.key === 'Platform' ? (
                  <DarkText>{item?.value?.join(', ')}</DarkText>
                ) : (
                  <DarkText>{item?.value}</DarkText>
                )}
              </FlexWrapper>
            ))}
          </Grid>
          {data?.notes?.trim() && (
            <FlexWrapper direction="column" align="start" gap="6px" margin="20px 0 10px">
              <DarkText>Note</DarkText>
              <TextArea style={{ resize: 'none' }} readOnly value={data?.notes} rows={4} />
            </FlexWrapper>
          )}
          {!isEmployee && (
            <>
              <FlexWrapper direction="column" gap="6px" align="start" margin="30px 0">
                <Title level={4} style={{ margin: 0 }}>
                  Billing Details
                </Title>
                <Grid style={{ width: '100%', margin: '20px 0 0' }}>
                  {billingDetails?.map((item, index) => (
                    <FlexWrapper
                      key={index}
                      direction="column"
                      justify="start"
                      align="start"
                      gap="3px">
                      <GreyText>{item?.key}</GreyText>
                      {'Hired IDs' == item?.key ? (
                        <DarkText>
                          {item?.value?.length > 0 ? item?.value?.join(', ') : 'N/A'}
                        </DarkText>
                      ) : (
                        <DarkText>{item?.value}</DarkText>
                      )}
                    </FlexWrapper>
                  ))}
                </Grid>
              </FlexWrapper>
            </>
          )}
          <FlexWrapper direction="column" gap="6px" align="start">
            <Title level={4} style={{ margin: 0 }}>
              Team
            </Title>
            <FlexWrapper width="100%" gap="10px" justify="start" wrap="nowrap">
              <Container width="20%">
                <DarkText>Project Manager</DarkText>
                <FlexWrapper gap="4px" justify="start" margin="10px 0 0">
                  {project_manager_members?.emp_id?.first_name && (
                    <div
                      onClick={() => setInfoModal(project_manager_members)}
                      style={{ cursor: 'pointer' }}>
                      <AvatarGroupRow
                        name={getFullName(
                          project_manager_members?.emp_id?.first_name,
                          project_manager_members?.emp_id?.middle_name,
                          project_manager_members?.emp_id?.last_name
                        )}
                        baseUrl={
                          process.env.REACT_APP_S3_BASE_URL +
                          image_end +
                          project_manager_members?.emp_id?.id
                        }
                        role={project_manager_members?.role}
                      />
                    </div>
                  )}

                  {canUpdate && (
                    <AddMemeberModal
                      type={'Project Manager'}
                      selectedUser={project_manager_members ? [project_manager_members] : []}
                      handleListing={handleGetDetails}
                      filterOption={
                        employee_members?.length > 0 &&
                        project_incharge_members?.length > 0 && [
                          ...employee_members,
                          ...project_incharge_members
                        ]
                      }
                    />
                  )}
                </FlexWrapper>
              </Container>

              <Container width={'80%'}>
                <DarkText>Project Incharge</DarkText>
                <FlexWrapper gap="4px" justify="start" margin="10px 0 0">
                  {project_incharge_members?.map((incharge, index) => {
                    let name = getFullName(
                      incharge?.emp_id?.first_name,
                      incharge?.emp_id?.middle_name,
                      incharge?.emp_id?.last_name
                    );
                    let url = process.env.REACT_APP_S3_BASE_URL + image_end + incharge?.emp_id?.id;
                    return (
                      <div
                        key={index}
                        onClick={() => setInfoModal(incharge)}
                        style={{ cursor: 'pointer' }}>
                        <AvatarGroupRow
                          key={index}
                          name={name}
                          baseUrl={url}
                          role={incharge?.role}
                        />
                      </div>
                    );
                  })}
                  {canUpdate && (
                    <AddMemeberModal
                      type={'Project Incharge'}
                      selectedUser={project_incharge_members}
                      handleListing={handleGetDetails}
                      filterOption={
                        employee_members?.length > 0 &&
                        project_manager_members && [...employee_members, project_manager_members]
                      }
                    />
                  )}
                </FlexWrapper>
              </Container>
            </FlexWrapper>
            <FlexWrapper width="100%" justify="start" wrap="nowrap">
              <Container width="100%">
                <DarkText>Team Members</DarkText>
                <FlexWrapper gap="4px" justify="start" margin="10px 0 0">
                  {employee_members?.map((incharge, index) => {
                    let name = getFullName(
                      incharge?.emp_id?.first_name,
                      incharge?.emp_id?.middle_name,
                      incharge?.emp_id?.last_name
                    );
                    let url = process.env.REACT_APP_S3_BASE_URL + image_end + incharge?.emp_id?.id;
                    return (
                      <div
                        key={index}
                        onClick={() => setInfoModal(incharge)}
                        style={{ cursor: 'pointer' }}>
                        <AvatarGroupRow
                          key={index}
                          name={name}
                          baseUrl={url}
                          role={incharge?.role}
                        />
                      </div>
                    );
                  })}
                  {canUpdate && (
                    <AddMemeberModal
                      type={'Team Member'}
                      selectedUser={employee_members}
                      handleListing={handleGetDetails}
                      filterOption={
                        project_manager_members &&
                        project_incharge_members?.length > 0 && [
                          ...project_incharge_members,
                          project_manager_members
                        ]
                      }
                    />
                  )}
                </FlexWrapper>
              </Container>
            </FlexWrapper>
          </FlexWrapper>
        </ContentWrapper>
      )}
    </>
  );
};

export default GeneralInfo;

GeneralInfo.propTypes = {
  project: PropTypes.object
};

const ContentWrapper = styled.div`
  background-color: white;
  height: 100%;
  border-radius: 12px;
  padding: 20px;
  font-family: ${fontFamilys?.poppinsFont};
  text-align: left;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-wrap: wrap;
  justify-content: center;
  gap: 20px 10px;
  margin: 20px 0;
`;

const Container = styled.div`
  width: ${({ width }) => width || 'fit-content'};
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 12px;
`;
