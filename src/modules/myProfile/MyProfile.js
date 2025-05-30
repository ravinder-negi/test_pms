import React, { useEffect, useRef, useState } from 'react';
import { Segmented } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FlexWrapper } from '../../theme/common_style';
import BasicInfo from '../employees/view-employee/components/BasicInfo';
import GeneralInfo from '../employees/view-employee/components/GeneralInfo';
import EmployeeDocuments from '../employees/view-employee/components/EmployeeDocuments';
import SalaryInfo from '../employees/view-employee/components/SalaryInfo';
import Remarks from '../employees/view-employee/components/Remarks';
import { viewEmployeeApi } from '../../redux/employee/apiRoute';
import { updateActiveTab } from '../../redux/employee/EmployeeSlice';

const MyProfile = () => {
  const activeTab = useSelector((state) => state?.employeeSlice?.activeTab);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const userdetail = useSelector((e) => e?.userInfo?.data?.user_details);

  const wrapperRef = useRef(null);

  const handleGetEmployeeDetails = async () => {
    try {
      setLoading(true);
      let res = await viewEmployeeApi(userdetail?.id);
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
    handleGetEmployeeDetails();
    wrapperRef.current?.scrollIntoView();
  }, []);

  return (
    <div ref={wrapperRef}>
      <FlexWrapper justify="start" style={{ marginTop: '20px' }}>
        <Segmented
          prefixCls="antCustomSegmented"
          value={activeTab}
          options={['General Info', 'Documents', 'Salary', 'Remarks']}
          onChange={(value) => {
            dispatch(updateActiveTab(value));
          }}
        />
      </FlexWrapper>
      {activeTab === 'General Info' && <BasicInfo loading={loading} details={details} />}
      {activeTab === 'General Info' && (
        <GeneralInfo loading={loading} details={details} handleList={handleGetEmployeeDetails} />
      )}
      {activeTab === 'Documents' && <EmployeeDocuments />}
      {activeTab === 'Salary' && <SalaryInfo />}
      {activeTab === 'Remarks' && <Remarks />}
    </div>
  );
};

export default MyProfile;
