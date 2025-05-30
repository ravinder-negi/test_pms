import React, { useEffect } from 'react';
import { Button, DatePicker, Drawer, Form, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import useDepartmentOptions from '../../hooks/useDepartmentOptions';
import useEmployeeOptions from '../../hooks/useEmployeeOptions';
import TableLoader from '../../components/loaders/TableLoader';
import useProjectOptions from '../../hooks/useProjectOptions';
import { updateFilters } from '../../redux/reporting/ReportingSlice';
import { DropdownIconNew } from '../../theme/SvgIcons';
import { FieldBox } from '../projects/ProjectStyle';

const ReportingFilters = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const appliedFilter = useSelector((e) => e?.reportingSlice?.filterData);
  const { data, isEmployee } = useSelector((state) => state?.userInfo);
  const RangePicker = DatePicker.RangePicker;
  const { options: departmentOptions, loading: loadingDepartments } = useDepartmentOptions();
  const { loading: employeeLoading, options: employeeOption } = useEmployeeOptions();
  const { options, loading: projectLoading } = useProjectOptions(
    isEmployee ? data?.user_details?.id : null
  );

  const onSubmit = (values) => {
    const formattedValues = {
      ...values
    };
    dispatch(updateFilters(formattedValues));
    onClose();
  };

  const onReset = () => {
    form.resetFields();
    dispatch(updateFilters(null));
    onClose();
  };

  useEffect(() => {
    if (appliedFilter) {
      form.setFieldsValue({
        ...appliedFilter,
        date: [
          appliedFilter?.date?.[0]
            ? dayjs(appliedFilter.date?.[0]).isValid()
              ? dayjs(appliedFilter.date?.[0])
              : null
            : null,
          appliedFilter?.date?.[1]
            ? dayjs(appliedFilter.date?.[1]).isValid()
              ? dayjs(appliedFilter.date?.[1])
              : null
            : null
        ]
      });
    }
  }, [appliedFilter]);

  return (
    <Drawer
      width={490}
      title="Filters"
      placement="right"
      closable={true}
      prefixCls="activityCustomDrawer"
      onClose={onClose}
      open={open}
      key="right">
      <ContainerStyle>
        {!loadingDepartments && !employeeLoading && !projectLoading ? (
          <Form style={{ height: '100%' }} form={form} onFinish={onSubmit}>
            {() => (
              <div className="filter-flex">
                <div>
                  <FieldBox>
                    <label>Filter by Project</label>
                    <Form.Item name="projectId">
                      <Select
                        className="customHeight"
                        allowClear
                        suffixIcon={<DropdownIconNew />}
                        loading={projectLoading}
                        placeholder="--Select Option--"
                        options={options}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </FieldBox>
                  {!isEmployee && (
                    <FieldBox>
                      <label>Filter by Employee</label>
                      <Form.Item name="empId">
                        <Select
                          className="customHeight"
                          allowClear
                          suffixIcon={<DropdownIconNew />}
                          loading={employeeLoading}
                          placeholder="--Select Option--"
                          options={employeeOption}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                        />
                      </Form.Item>
                    </FieldBox>
                  )}
                  {!isEmployee && (
                    <FieldBox>
                      <label>Filter by Department</label>
                      <Form.Item name="department">
                        <Select
                          className="customHeight"
                          allowClear
                          suffixIcon={<DropdownIconNew />}
                          loading={loadingDepartments}
                          placeholder="--Select Option--"
                          options={departmentOptions}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                        />
                      </Form.Item>
                    </FieldBox>
                  )}
                  <FieldBox>
                    <label>Filter by Date</label>
                    <Form.Item name="date">
                      <RangePicker
                        name="date"
                        allowClear={false}
                        format={'YYYY-MM-DD'}
                        className="date-picker customHeight"
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                        style={{
                          width: '100%',
                          height: '40px',
                          borderRadius: '8px',
                          textAlign: 'center !important'
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

export default ReportingFilters;

ReportingFilters.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
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

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 24px;
  gap: 12px;

  .reset {
    width: 100%;
    border-radius: 10px;
    border: 1px solid #0e0e0e;
    color: #0e0e0e;
    background: transparent;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 14px;
  }
`;
