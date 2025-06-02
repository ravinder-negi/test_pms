import React, { useEffect } from 'react';
import { Button, DatePicker, Drawer, Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import useDepartmentOptions from '../../hooks/useDepartmentOptions';
import useEmployeeOptions from '../../hooks/useEmployeeOptions';
import TableLoader from '../../components/loaders/TableLoader';
import useProjectOptions from '../../hooks/useProjectOptions';
import { DropdownIconNew } from '../../theme/SvgIcons';
import { FieldBox } from '../projects/ProjectStyle';
import { ButtonWrapper } from '../../theme/common_style';

const ReportingFilters = ({ open, onClose, setAppliedFilter, appliedFilter }) => {
  const [form] = Form.useForm();
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
    setAppliedFilter(formattedValues);
    onClose();
  };

  const onReset = () => {
    form.resetFields();
    setAppliedFilter(null);
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
                    <label htmlFor="projectId">Filter by Project</label>
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
                      <label htmlFor="empId">Filter by Employee</label>
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
                      <label htmlFor="department">Filter by Department</label>
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
                    <label htmlFor="date">Filter by Date</label>
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
  onClose: PropTypes.func,
  setAppliedFilter: PropTypes.func,
  appliedFilter: PropTypes.object
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
