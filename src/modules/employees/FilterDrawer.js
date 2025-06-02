/* eslint-disable react/prop-types */
import styled from '@emotion/styled';
import { Button, Checkbox, Drawer, Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import useDepartmentOptions from '../../hooks/useDepartmentOptions';
import useDesignationOptions from '../../hooks/useDesignationOptions';
import TableLoader from '../../components/loaders/TableLoader';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters } from '../../redux/employee/EmployeeSlice';
import { DropdownIconNew } from '../../theme/SvgIcons';

const FilterDrawer = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { options: departmentOptions, loading: loadingDepartments } = useDepartmentOptions();
  const [designationOptions, setDesignationOptions] = useState([]);
  const dispatch = useDispatch();
  const appliedFilter = useSelector((e) => e?.employeeSlice?.filterData);

  const onFinish = async (values) => {
    dispatch(updateFilters(values));
    onClose();
  };

  const fetchDesignation = async () => {
    const id = form.getFieldValue('department') ?? appliedFilter?.department;
    if (id) {
      const res = await useDesignationOptions(id);
      const formattedOptions = res?.map((el) => ({
        label: el?.designation,
        value: el?.id
      }));
      setDesignationOptions(formattedOptions);
    }
  };

  const onReset = () => {
    form.resetFields();
    dispatch(updateFilters({}));
    onClose();
  };

  useEffect(() => {
    if (appliedFilter) {
      form.setFieldsValue(appliedFilter);
      if (appliedFilter?.department || form.getFieldValue('department')) {
        fetchDesignation();
      }
    }
  }, [departmentOptions]);

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
      <FilterWrapper>
        {!loadingDepartments ? (
          <Form style={{ height: '100%' }} form={form} layout="vertical" onFinish={onFinish}>
            <div className="filter-flex">
              <div>
                <div className="section">
                  <h2>Filter by Department</h2>
                  <VerticalCheckboxGroup>
                    <Form.Item name="department">
                      <Select
                        prefixCls="form-select"
                        suffixIcon={<DropdownIconNew />}
                        value={form.getFieldValue('department')}
                        onChange={() => {
                          fetchDesignation();
                          form.setFieldValue('designation', undefined);
                        }}
                        placeholder="--Select Option--">
                        {Array.isArray(departmentOptions) &&
                          departmentOptions.map((el, index) => (
                            <Select.Option
                              key={index}
                              value={el?.value}
                              style={{ textTransform: 'capitalize' }}>
                              {el?.label}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </VerticalCheckboxGroup>
                </div>
                <div className="section">
                  <h2>Filter by Designation</h2>
                  <VerticalCheckboxGroup>
                    <Form.Item name="designation">
                      <Select
                        disabled={form.getFieldValue('department') ? false : true}
                        prefixCls="form-select"
                        mode="single"
                        suffixIcon={<DropdownIconNew />}
                        placeholder="--Select Option--"
                        options={designationOptions}
                      />
                    </Form.Item>
                  </VerticalCheckboxGroup>
                </div>
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
          </Form>
        ) : (
          <div className="loader">
            <TableLoader size="30px" />
          </div>
        )}
      </FilterWrapper>
    </Drawer>
  );
};

export default FilterDrawer;

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

const FilterWrapper = styled.div`
  width: 100%;
  padding: 20px;
  height: 100%;
  position: relative;

  .filter-flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-bottom: 20px;
  }

  .loader {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .section {
    width: 100%;

    h2 {
      color: #0e0e0e;
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 16px;
      margin: 0;
    }
  }
`;

const VerticalCheckboxGroup = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
`;
