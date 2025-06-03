import React, { useEffect, useState } from 'react';
import { FlexWrapper, GridBox } from '../../../../theme/common_style';
import { EditIcon, NoSalaryInfoIcon } from '../../../../theme/SvgIcons';
import { PersonalInfoStyle, ProfileBox } from '../ViewEmployeeStyle';
import AddSalaryInfo from '../modals/AddSalaryInfo';
import { toast } from 'react-toastify';
import { getEmployeeBankInfo, getEmployeeSalaryApi } from '../../../../redux/employee/apiRoute';
import { useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import AddBankInfo from '../modals/AddBankInfo';
import moment from 'moment';
import NoData from '../../../../components/common/NoData';
import { useSelector } from 'react-redux';
import { checkPermission } from '../../../../utils/common_functions';
import { useCurrentModule } from '../../../../hooks/useCurrentModule';

const SalaryInfo = () => {
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [bankInfo, setBankInfo] = useState(null);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = useCurrentModule();
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const [addSalaryInfo, setAddSalaryInfo] = useState(false);
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);
  const [addBankInfo, setAddBankInfo] = useState(false);
  const { id } = useParams();

  const handleSalaryInfo = async () => {
    try {
      setSalaryLoading(true);
      let res = await getEmployeeSalaryApi(id);
      if (res?.statusCode === 200) {
        setSalaryInfo(res?.data?.[0]);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setSalaryLoading(false);
    }
  };

  const handleBankInfo = async () => {
    try {
      setBankLoading(true);
      let res = await getEmployeeBankInfo(id);
      if (res?.statusCode === 200) {
        setBankInfo(res?.data);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setBankLoading(false);
    }
  };

  useEffect(() => {
    handleSalaryInfo();
    handleBankInfo();
  }, []);

  return (
    <>
      {addSalaryInfo && (
        <AddSalaryInfo
          open={addSalaryInfo}
          onClose={() => setAddSalaryInfo(false)}
          handleList={handleSalaryInfo}
          editDetails={salaryInfo}
        />
      )}
      {addBankInfo && (
        <AddBankInfo
          open={addBankInfo}
          onClose={() => setAddBankInfo(false)}
          handleList={handleBankInfo}
          editDetails={bankInfo}
        />
      )}
      <ProfileBox style={{ margin: '12px 0px' }}>
        {!salaryLoading ? (
          <PersonalInfoStyle>
            <div className="title">
              <h5>Salary Info</h5>
              {salaryInfo
                ? canUpdate && (
                    <div className="edit-profile" onClick={() => setAddSalaryInfo(true)}>
                      <EditIcon />
                    </div>
                  )
                : canCreate && (
                    <h6 className="add-title" onClick={() => setAddSalaryInfo(true)}>
                      + Add Salary Info
                    </h6>
                  )}
            </div>

            {!salaryInfo ? (
              <NoData subTitle="No Salary Info" height={'150px'} img={<NoSalaryInfoIcon />} />
            ) : (
              <div className="details" style={{ alignItems: 'start', padding: '20px 0 0' }}>
                <div className="names" style={{ width: '50%' }}>
                  <GridBox cols="2">
                    <p>Basic Salary (INR)</p>
                    <p className="values">{salaryInfo?.basic_salary || 'N/A'}</p>
                  </GridBox>
                  <GridBox cols="2">
                    <p>Effective Date</p>
                    <p className="values">
                      {salaryInfo?.effective_date
                        ? moment(salaryInfo?.effective_date).format('DD-MM-YYYY')
                        : 'N/A'}
                    </p>
                  </GridBox>
                  <GridBox cols="2">
                    <p>Next review Date</p>
                    <p className="values">
                      {salaryInfo?.next_review_date
                        ? moment(salaryInfo?.next_review_date).format('DD-MM-YYYY')
                        : 'N/A'}
                    </p>
                  </GridBox>
                  <GridBox cols="2">
                    <p>Last CTC (INR)</p>
                    <p className="values">{salaryInfo?.last_ctc || 'N/A'}</p>
                  </GridBox>
                </div>
                <div className="line" style={{ height: '130px' }} />
                <div className="names contacts" style={{ width: '50%', paddingLeft: '33px' }}>
                  <GridBox cols="2">
                    <p>In Hand Salary (INR)</p>
                    <p className="values">{salaryInfo?.inhand_salary || 'N/A'}</p>
                  </GridBox>
                  <GridBox cols="2">
                    <p>Last Salary Review</p>
                    <p className="values">
                      {salaryInfo?.last_salary_date
                        ? moment(salaryInfo?.last_salary_date).format('DD-MM-YYYY')
                        : 'N/A'}
                    </p>
                  </GridBox>
                  <GridBox cols="2">
                    <p>Hike on last salary</p>
                    <p className="values">
                      {salaryInfo?.last_salary_hike ? salaryInfo?.last_salary_hike + '%' : 'N/A'}
                    </p>
                  </GridBox>
                </div>
              </div>
            )}
          </PersonalInfoStyle>
        ) : (
          <PersonalInfoStyle>
            <Skeleton active title={false} paragraph={{ rows: 6 }} />
          </PersonalInfoStyle>
        )}
      </ProfileBox>
      <ProfileBox>
        {!bankLoading ? (
          <PersonalInfoStyle>
            <div className="title">
              <h5>Bank Info</h5>
              {bankInfo
                ? canUpdate && (
                    <div className="edit-profile" onClick={() => setAddBankInfo(true)}>
                      <EditIcon />
                    </div>
                  )
                : canCreate && (
                    <h6
                      className="add-title"
                      onClick={() => {
                        setAddBankInfo(true);
                      }}>
                      + Add Bank Info
                    </h6>
                  )}
            </div>
            {!bankInfo ? (
              <NoData subTitle="No Bank Info" height={'150px'} img={<NoSalaryInfoIcon />} />
            ) : (
              <FlexWrapper justify="start" gap="15%">
                <div className="job-details">
                  <p>Bank Account Number</p>
                  <h5>{bankInfo?.bank_account || 'N/A'}</h5>
                </div>
                <div className="job-details">
                  <p>Branch Name</p>
                  <h5>{bankInfo?.branch_name || 'N/A'}</h5>
                </div>
                <div className="job-details">
                  <p>IFSC</p>
                  <h5>{bankInfo?.ifsc_code || 'N/A'}</h5>
                </div>
              </FlexWrapper>
            )}
          </PersonalInfoStyle>
        ) : (
          <PersonalInfoStyle>
            <Skeleton active title={false} paragraph={{ rows: 2 }} />
          </PersonalInfoStyle>
        )}
      </ProfileBox>
    </>
  );
};

export default SalaryInfo;
