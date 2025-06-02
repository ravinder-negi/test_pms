import styled from '@emotion/styled';
import { Button, DatePicker, Drawer, Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { DropdownIconNew } from '../../theme/SvgIcons';
import { useSelector } from 'react-redux';
import { ButtonWrapper, FieldBox } from '../../theme/common_style';
import useDepartmentOptions from '../../hooks/useDepartmentOptions';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { getEmployeeRolesApi } from '../../redux/employee/apiRoute';
import { leave_type, leaveOptions, leaveStatus, leaveTabEnum } from '../../utils/constant';
import TableLoader from '../../components/loaders/TableLoader';

const LmsFilter = ({ open, onClose, appliedFilter, setAppliedFilter }) => {
  const [form] = Form.useForm();
  const { loading: departmentOptionLoading, options: departmentOptions } = useDepartmentOptions();
  const { isEmployee } = useSelector((e) => e.userInfo);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [roleOptionLoading, setRoleOptionLoading] = useState(false);
  const activeTab = useSelector((state) => state?.LmsSlice?.LmsTab);

  const getEmployeeRoles = async () => {
    setRoleOptionLoading(true);
    try {
      let res = await getEmployeeRolesApi();
      if (res?.statusCode === 200) {
        let array = res?.data?.roles?.map((el) => ({
          ...el,
          label: el?.role,
          value: el?.id
        }));
        setEmployeeRoles(array);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRoleOptionLoading(false);
    }
  };

  const onSubmit = (values) => {
    const payload = { ...values };

    if (payload.date) {
      payload.date = dayjs(payload.date).format('YYYY-MM-DD');
    }

    setAppliedFilter(payload);
    onClose();
  };

  const onReset = () => {
    form.resetFields();
    setAppliedFilter({});
    onClose();
  };

  useEffect(() => {
    if (appliedFilter && !roleOptionLoading && !departmentOptionLoading) {
      const newFilter = { ...appliedFilter };

      if (newFilter.date) {
        newFilter.date = dayjs(newFilter.date);
      }

      form.setFieldsValue(newFilter);
    }
    getEmployeeRoles();
  }, [appliedFilter]);

  return (
    <Drawer
      width={400}
      title="Filters"
      placement="right"
      closable={true}
      prefixCls="activityCustomDrawer"
      onClose={onClose}
      open={open}
      key="right">
      <ContainerStyle>
        {!roleOptionLoading && !departmentOptionLoading ? (
          <Form style={{ height: '100%' }} form={form} onFinish={onSubmit}>
            {() => (
              <div className="filter-flex">
                <div>
                  {!isEmployee && (
                    <>
                      <FieldBox>
                        <label htmlFor="roleId">Filter by Role</label>
                        <Form.Item name="roleId">
                          <Select
                            prefixCls="form-select"
                            allowClear
                            suffixIcon={<DropdownIconNew />}
                            loading={roleOptionLoading}
                            placeholder="--Select Option--"
                            options={employeeRoles}
                          />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label htmlFor="department">Filter by Department</label>
                        <Form.Item name="department">
                          <Select
                            prefixCls="form-select"
                            allowClear
                            suffixIcon={<DropdownIconNew />}
                            loading={departmentOptionLoading}
                            placeholder="--Select Option--"
                            options={departmentOptions}
                          />
                        </Form.Item>
                      </FieldBox>
                    </>
                  )}
                  <FieldBox>
                    <label htmlFor="leave_type">Filter by Leave Type</label>
                    <Form.Item name="leave_type">
                      <Select
                        prefixCls="form-select"
                        allowClear
                        suffixIcon={<DropdownIconNew />}
                        placeholder="--Select Option--"
                        options={leave_type}
                      />
                    </Form.Item>
                  </FieldBox>
                  <FieldBox>
                    <label htmlFor="leave_category">Filter by Leave Category</label>
                    <Form.Item name="leave_category">
                      <Select
                        prefixCls="form-select"
                        allowClear
                        suffixIcon={<DropdownIconNew />}
                        placeholder="--Select Option--"
                        options={leaveOptions}
                      />
                    </Form.Item>
                  </FieldBox>
                  <FieldBox>
                    <label htmlFor="leave_status">Filter by Status</label>
                    <Form.Item name="leave_status">
                      <Select
                        prefixCls="form-select"
                        allowClear
                        suffixIcon={<DropdownIconNew />}
                        placeholder="--Select Option--"
                        options={leaveStatus}
                      />
                    </Form.Item>
                  </FieldBox>
                  <FieldBox>
                    <label htmlFor="date">Filter by Start Date</label>
                    <Form.Item name="date">
                      <DatePicker
                        placeholder="DD/MM/YYYY"
                        prefixCls="form-datepicker"
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                        disabledDate={(current) => {
                          const today = new Date();
                          const currentDate = current;
                          const todayDate = new Date(today.setHours(0, 0, 0, 0));

                          return activeTab === leaveTabEnum?.PAST
                            ? currentDate > todayDate
                            : currentDate < todayDate;
                        }}
                      />
                    </Form.Item>
                  </FieldBox>
                </div>

                <div style={{ paddingBottom: '20px' }}>
                  <ButtonWrapper>
                    <button className="reset" onClick={onReset}>
                      Reset
                    </button>
                    <Button prefixCls="antCustomBtn" style={{ width: '100%' }} htmlType="submit">
                      Apply
                    </Button>
                  </ButtonWrapper>
                </div>
              </div>
            )}
          </Form>
        ) : (
          <div
            className="loader"
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <TableLoader size="30px" />
          </div>
        )}
      </ContainerStyle>
    </Drawer>
  );
};

export default LmsFilter;

LmsFilter.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  appliedFilter: PropTypes.object,
  setAppliedFilter: PropTypes.func
};

const ContainerStyle = styled.div`
  width: 100%;
  padding: 10px 25px;
  height: 100%;

  .filter-flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-bottom: 20px;
  }
`;
