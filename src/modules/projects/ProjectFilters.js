/* eslint-disable react/prop-types */
import styled from '@emotion/styled';
import { Button, DatePicker, Drawer, Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { DropdownIconNew } from '../../theme/SvgIcons';
import { FieldBox } from './ProjectStyle';
import useClientOptions from '../../hooks/useClientOptions';
import useEmployeeOptions from '../../hooks/useEmployeeOptions';
import { projectStatusOption } from '../../utils/constant';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters } from '../../redux/project/ProjectSlice';

const { RangePicker } = DatePicker;

const ProjectFilters = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const appliedFilter = useSelector((e) => e?.projectSlice?.filterData);
  const { loading: clientOptionLoading, options: clientOptions } = useClientOptions();
  const { loading: employeeLoading, options: employeeOption } = useEmployeeOptions();
  const dispatch = useDispatch();
  const onSubmit = (values) => {
    const formattedValues = {
      ...values,
      startDateRange: values.startDateRange
        ? values.startDateRange.map((date) => dayjs(date).format('YYYY-MM-DD'))
        : undefined,
      deadlineRange: values.deadlineRange
        ? values.deadlineRange.map((date) => dayjs(date).format('YYYY-MM-DD'))
        : undefined
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
        startDateRange: appliedFilter.startDateRange
          ? appliedFilter.startDateRange.map((date) => dayjs(date))
          : undefined,
        deadlineRange: appliedFilter.deadlineRange
          ? appliedFilter.deadlineRange.map((date) => dayjs(date))
          : undefined
      });
    }
  }, [appliedFilter]);

  return (
    <Drawer
      width={390}
      title="Filters"
      placement="right"
      closable={true}
      prefixCls="activityCustomDrawer"
      onClose={onClose}
      open={open}
      key="right">
      <ContainerStyle>
        <Form style={{ height: '100%' }} form={form} onFinish={onSubmit}>
          {() => (
            <div className="filter-flex">
              <div>
                <FieldBox>
                  <label>Filter by Client</label>
                  <Form.Item name="clientIds">
                    <Select
                      prefixCls="form-select"
                      allowClear
                      suffixIcon={<DropdownIconNew />}
                      loading={clientOptionLoading}
                      placeholder="--Select Option--"
                      options={clientOptions}
                    />
                  </Form.Item>
                </FieldBox>
                <FieldBox>
                  <label>Filter by Employee</label>
                  <Form.Item name="employeeIds">
                    <Select
                      prefixCls="form-select"
                      allowClear
                      suffixIcon={<DropdownIconNew />}
                      loading={employeeLoading}
                      placeholder="--Select Option--"
                      options={employeeOption}
                    />
                  </Form.Item>
                </FieldBox>
                <FieldBox>
                  <label>Filter by Status</label>
                  <Form.Item name="status">
                    <Select
                      prefixCls="form-select"
                      allowClear
                      suffixIcon={<DropdownIconNew />}
                      loading={employeeLoading}
                      placeholder="--Select Option--">
                      {projectStatusOption.map((el) => (
                        <Select.Option key={el.id} value={el.value}>
                          {el.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </FieldBox>
                <FieldBox>
                  <label>Filter by Start Date</label>
                  <Form.Item name="startDateRange">
                    <RangePicker
                      style={{ width: '100%', height: '40px' }}

                      // disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                  </Form.Item>
                </FieldBox>
                <FieldBox>
                  <label>Filter by Deadline</label>
                  <Form.Item name="deadlineRange">
                    <RangePicker
                      style={{ width: '100%', height: '40px' }}
                      // disabledDate={(current) => current && current > dayjs().endOf('day')}
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
      </ContainerStyle>
    </Drawer>
  );
};

export default ProjectFilters;

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
